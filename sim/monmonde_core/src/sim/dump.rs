use std::fs;

use glicko2::GlickoRating;
use rusqlite::{params, types::ToSqlOutput, Connection, Result, ToSql};
use slotmap::Key;

use super::{Gender, Sim, TrainerKey};

impl Sim {
    pub fn dump(&mut self) {
        let _ = fs::remove_file("./dump.db3");
        let mut conn = Connection::open("./dump.db3").unwrap();
        conn.execute_batch(
            "
            CREATE TABLE region (
                code CHAR(3) PRIMARY KEY,
                code2 CHAR(2) NOT NULL,
                name VARCHAR(64) NOT NULL
            );

            CREATE TABLE trainer (
                id INTEGER PRIMARY KEY,
                given_name VARCHAR(64) NOT NULL,
                family_name VARCHAR(64) NOT NULL,
                home_region CHAR(3) REFERENCES region(code),
                birth_region CHAR(3) REFERENCES region(code),
                gender VARCHAR(16),
                location CHAR(3) REFERENCES region(code),

                ability INTEGER NOT NULL,
                potential INTEGER NOT NULL,

                consistency INTEGER NOT NULL,

                league_wins INTEGER NOT NULL,
                league_losses INTEGER NOT NULL,
                league_rating_value REAL NOT NULL,
                league_rating_deviation REAL NOT NULL
            );

            CREATE TABLE ranking_entry (
                id SERIAL PRIMARY KEY,
                trainer_id INTEGER REFERENCES trainer(id)
            );

            CREATE VIEW view_ranking AS
                SELECT re.id, re.trainer_id, t.given_name, t.family_name, t.gender, t.home_region,
                       t.league_rating_value, t.league_rating_deviation
                FROM ranking_entry re
                LEFT JOIN trainer t ON t.id = re.trainer_id;
        ",
        )
        .unwrap();

        let tx = conn.transaction().unwrap();

        for r in &self.regions {
            tx.execute(
                "INSERT INTO region (code, code2, name) VALUES (?1, ?2, ?3)",
                params![r.code, r.code2, r.name],
            )
            .unwrap();
        }

        for trainer_key in &self.all_trainers {
            let t_info = &self.trainer_infos[*trainer_key];
            let l_record = &self.league_records[*trainer_key];
            let rating: GlickoRating = l_record.rating.into(); // Convert from glicko2
            tx.execute(
                "INSERT INTO trainer (id, given_name, family_name, home_region, birth_region,
                                      gender, location, ability, potential, consistency,
                                      league_wins, league_losses, league_rating_value,
                                      league_rating_deviation)
                VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)",
                params![
                    trainer_key,
                    t_info.given_name,
                    t_info.family_name,
                    t_info.home_region,
                    t_info.birth_region,
                    t_info.gender,
                    t_info.location,
                    t_info.ability,
                    t_info.potential,
                    t_info.consistency,
                    l_record.wins,
                    l_record.losses,
                    rating.value,
                    rating.deviation,
                ],
            )
            .unwrap();
        }

        self.update_ranking();
        for trainer_key in &self.last_league_ranking {
            tx.execute(
                "INSERT INTO ranking_entry (trainer_id) VALUES (?1)",
                params![trainer_key],
            )
            .unwrap();
        }

        tx.commit().unwrap();
    }
}

impl ToSql for TrainerKey {
    fn to_sql(&self) -> Result<ToSqlOutput<'_>> {
        // NOTE: The cast probably makes the value unusable but we aren't reading it back anyway
        Ok(ToSqlOutput::from(self.data().as_ffi() as i64))
    }
}

impl ToSql for Gender {
    fn to_sql(&self) -> Result<rusqlite::types::ToSqlOutput<'_>> {
        Ok(ToSqlOutput::from(match self {
            Gender::Male => "Male",
            Gender::Female => "Female",
            Gender::NonBinary => "NonBinary",
        }))
    }
}
