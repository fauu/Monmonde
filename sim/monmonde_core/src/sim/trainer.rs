use rand::{prelude::SliceRandom, Rng};
use rand_distr::Distribution;

use super::{league, person::Gender, region::WorldRegionCode, Sim};

slotmap::new_key_type! { pub struct TrainerKey; }

#[derive(Debug)]
pub(super) struct TrainerInfo {
    pub given_name: String,
    pub family_name: String,
    pub home_region: WorldRegionCode,
    pub birth_region: WorldRegionCode,
    pub gender: Gender,
    pub location: WorldRegionCode,

    pub ability: i32,
    pub potential: i32,

    pub consistency: i32,
}

impl Sim {
    pub fn gen_trainers(&mut self) {
        let mut rng = rand::thread_rng();
        let stat_distribution = rand_distr::Normal::new(30.0, 25.0).unwrap();
        for region in &self.regions {
            for i in 0..201 {
                let gender = match i {
                    0..=99 => Gender::Male,
                    100..=199 => Gender::Female,
                    _ => Gender::NonBinary,
                };
                let names = &self.person_names[&region.code];
                let male_name_srcs = (&names.male_given, &names.male_family);
                let female_name_srcs = (&names.female_given, &names.female_family);
                let (given_name_src, family_name_src) = match gender {
                    Gender::Male => male_name_srcs,
                    Gender::Female => female_name_srcs,
                    Gender::NonBinary => {
                        if rng.gen_bool(0.5) {
                            male_name_srcs
                        } else {
                            female_name_srcs
                        }
                    }
                };
                let location = region.code.clone();
                let key = self.trainer_infos.insert(TrainerInfo {
                    given_name: given_name_src.choose(&mut rng).unwrap().to_string(),
                    family_name: family_name_src.choose(&mut rng).unwrap().to_string(),
                    home_region: region.code.clone(),
                    birth_region: region.code.clone(),
                    gender,
                    location: location.clone(),

                    ability: (stat_distribution.sample(&mut rng) as i32).clamp(10, 100),
                    potential: (stat_distribution.sample(&mut rng) as i32 + 35).clamp(10, 100),

                    consistency: (stat_distribution.sample(&mut rng) as i32).clamp(10, 100),
                });
                self.league_records.insert(key, league::Record::new());
                self.all_trainers.push(key);
                self.last_league_ranking.push(key);
            }
        }
    }
}
