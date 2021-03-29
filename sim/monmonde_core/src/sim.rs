pub mod dump;
mod league;
mod person;
mod region;
mod trainer;

use std::collections::HashMap;

use rand::{prelude::SliceRandom, rngs, seq};
use rand_distr::Distribution;
use rusqlite::Result;
use slotmap::{HopSlotMap, SecondaryMap, SlotMap};

use monmonde_chrono::{DateTime, Duration};

use crate::slotmap::GivesMutPairForSlotmapKeys;

use self::{
    person::{Gender, PersonNameSet},
    region::{load_regions, WorldRegion, WorldRegionCode},
    trainer::{TrainerInfo, TrainerKey},
};

#[allow(dead_code)]
type ComponentMap<K, V> = SlotMap<K, V>;
#[allow(dead_code)]
type SecondaryComponentMap<K, V> = SecondaryMap<K, V>;
#[allow(dead_code)]
type HopComponentMap<K, V> = HopSlotMap<K, V>;

pub struct Sim {
    person_names: HashMap<WorldRegionCode, PersonNameSet>,

    datetime: DateTime,
    regions: Vec<WorldRegion>,

    trainer_infos: ComponentMap<TrainerKey, TrainerInfo>,
    league_records: SecondaryComponentMap<TrainerKey, league::Record>,

    all_trainers: Vec<TrainerKey>,
    last_league_ranking: Vec<TrainerKey>,
}

static DAILY_TRAINER_TRAVEL_CHANCE: f32 = 0.05;

// TODO-IMMEDIATE: Encapsulate glicko and move the ranking calculations to that module

impl Sim {
    #[allow(clippy::new_without_default)]
    pub fn new() -> Sim {
        let regions = load_regions();
        Sim {
            person_names: PersonNameSet::load_for_each_region(&regions),

            datetime: DateTime::of(1, 1, 0, 0).unwrap(),
            regions,

            trainer_infos: ComponentMap::with_key(),
            league_records: SecondaryComponentMap::new(),

            all_trainers: Vec::new(),
            last_league_ranking: Vec::new(),
        }
    }

    pub fn init(&mut self) {
        self.gen_trainers();
    }

    #[allow(clippy::result_unit_err)]
    pub fn advance(&mut self, delta: Duration) -> Result<(), ()> {
        if delta <= Duration::zero() {
            Err(())
        } else {
            self.datetime = self.datetime + delta;

            let mut rng = rand::thread_rng();
            let num_daily_travel_picks =
                (DAILY_TRAINER_TRAVEL_CHANCE * (self.all_trainers.len() as f32)).round() as usize;

            for _ in 0..delta.num_days() {
                self.do_daily_trainer_travels(&mut rng, num_daily_travel_picks);
                self.do_full_trainer_iteration(&mut rng);
            }

            Ok(())
        }
    }

    pub fn datetime(&self) -> DateTime {
        self.datetime
    }
}

impl Sim {
    fn do_daily_trainer_travels(&mut self, mut rng: &mut rngs::ThreadRng, num_daily_picks: usize) {
        let indices = seq::index::sample(&mut rng, self.all_trainers.len(), num_daily_picks);
        for i in indices {
            let trainer_key = self.all_trainers[i];
            let trainer_component = self.trainer_infos.get_mut(trainer_key).unwrap();
            loop {
                let to = &self.regions.choose(&mut rng).unwrap().code;
                let from = &trainer_component.location;
                if to == from {
                    continue;
                }
                trainer_component.location = to.clone();
                break;
            }
        }
    }

    fn do_full_trainer_iteration(&mut self, mut rng: &mut rngs::ThreadRng) {
        // PERF: Cache and clear
        let mut will_battle: HashMap<WorldRegionCode, Vec<TrainerKey>> = HashMap::new();
        for region in &self.regions {
            // PERF: Initial capacity
            will_battle.insert(region.code.clone(), Vec::new());
        }

        let normal_0_1 = rand_distr::Normal::new(0.0, 1.0).unwrap();
        let normal_1_005 = rand_distr::Normal::new(1.0, 0.05).unwrap();
        let poisson_2 = rand_distr::Poisson::new(2.0).unwrap();

        for trainer_key in &self.all_trainers {
            let trainer_component = &self.trainer_infos[*trainer_key];
            let num_battles = poisson_2.sample(&mut rng) as i32;
            let will_battle_bucket = will_battle.get_mut(&trainer_component.location).unwrap();
            for _ in 0..num_battles {
                will_battle_bucket.push(*trainer_key);
            }
        }

        for region in &self.regions {
            let bucket = &mut will_battle.get_mut(&region.code).unwrap();
            bucket.shuffle(&mut rng);
        }

        for (_, mut trainer_keys) in will_battle {
            'region_trainers: loop {
                if trainer_keys.len() < 2 {
                    break 'region_trainers;
                }

                let t1_key = trainer_keys.swap_remove(0);
                let mut t2_key = trainer_keys.swap_remove(0);
                let mut tries_remaining = trainer_keys.len();
                loop {
                    if t1_key != t2_key {
                        break;
                    }
                    trainer_keys.push(t2_key);
                    if tries_remaining == 0 {
                        break 'region_trainers;
                    }
                    t2_key = trainer_keys.swap_remove(0);
                    tries_remaining -= 1;
                }

                let t1c = &self.trainer_infos[t1_key];
                let t1_inconsistency_factor =
                    ((100 - t1c.consistency) / 8) as f32 * normal_0_1.sample(&mut rng);
                let t1_random_factor = normal_1_005.sample(&mut rng);
                let t1_effective_ability = (((t1c.ability as f32 - t1_inconsistency_factor)
                    * t1_random_factor) as i32)
                    .clamp(0, 100);

                let t2c = &self.trainer_infos[t2_key];
                let t2_inconsistency_factor =
                    ((100 - t2c.consistency) / 8) as f32 * normal_0_1.sample(&mut rng);
                let t2_random_factor = normal_1_005.sample(&mut rng);
                let t2_effective_ability = (((t2c.ability as f32 - t2_inconsistency_factor)
                    * t2_random_factor) as i32)
                    .clamp(0, 100);

                let t1_won = t1_effective_ability >= t2_effective_ability;
                let (mut t1_rec, mut t2_rec) = self.league_records.get_mut_pair(&t1_key, &t2_key);
                league::record_battle_result(&mut t1_rec, &mut t2_rec, t1_won)
            }
        }
    }

    fn update_ranking(&mut self) {
        let records = &mut self.league_records;
        self.last_league_ranking.sort_unstable_by(|a, b| {
            records[*a]
                .rating
                .value
                .partial_cmp(&records[*b].rating.value)
                .unwrap()
                .reverse()
        });
    }
}
