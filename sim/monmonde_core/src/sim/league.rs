use std::mem;

use glicko2::{GameResult, Glicko2Rating};

#[derive(Debug)]
pub(super) struct Record {
    pub wins: i32,
    pub losses: i32,
    pub rating: Glicko2Rating,
}

impl Default for Record {
    fn default() -> Self {
        Record {
            wins: 0,
            losses: 0,
            rating: Glicko2Rating::unrated(),
        }
    }
}

static TAU: f64 = 0.5;

impl Record {
    pub fn new() -> Self {
        Default::default()
    }
}

pub(super) fn record_battle_result<'a>(mut a: &'a mut Record, mut b: &'a mut Record, a_won: bool) {
    if !a_won {
        mem::swap(&mut a, &mut b);
    }

    a.wins += 1;
    a.rating = glicko2::new_rating(a.rating, &[GameResult::win(b.rating)], TAU);

    b.losses += 1;
    b.rating = glicko2::new_rating(b.rating, &[GameResult::win(a.rating)], TAU)
}
