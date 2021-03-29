use std::{collections::HashMap, fs};

use super::region::{WorldRegion, WorldRegionCode};

pub(super) struct PersonNameSet {
    pub male_given: Vec<String>,
    pub male_family: Vec<String>,
    pub female_given: Vec<String>,
    pub female_family: Vec<String>,
}

impl PersonNameSet {
    pub(super) fn load_for_each_region(
        regions: &[WorldRegion],
    ) -> HashMap<WorldRegionCode, PersonNameSet> {
        regions
            .iter()
            .map(|region| {
                let filename_prefix = format!("data/names/{}", region.code.to_ascii_lowercase());
                (
                    region.code.clone(),
                    PersonNameSet {
                        male_given: fs::read_to_string(format!("{}_m_first.txt", filename_prefix))
                            .unwrap()
                            .split('\n')
                            .map(|s| s.to_string())
                            .collect(),
                        male_family: fs::read_to_string(format!("{}_m_last.txt", filename_prefix))
                            .unwrap()
                            .split('\n')
                            .map(|s| s.to_string())
                            .collect(),
                        female_given: fs::read_to_string(format!(
                            "{}_f_first.txt",
                            filename_prefix
                        ))
                        .unwrap()
                        .split('\n')
                        .map(|s| s.to_string())
                        .collect(),
                        female_family: fs::read_to_string(format!(
                            "{}_f_last.txt",
                            filename_prefix
                        ))
                        .unwrap()
                        .split('\n')
                        .map(|s| s.to_string())
                        .collect(),
                    },
                )
            })
            .collect()
    }
}

#[derive(Debug)]
pub(super) enum Gender {
    Male,
    Female,
    #[allow(dead_code)]
    NonBinary,
}
