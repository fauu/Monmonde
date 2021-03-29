use std::fs;

use miniserde::{json, Deserialize};

pub type WorldRegionCode = String;

#[derive(Debug)]
pub(super) struct WorldRegion {
    pub name: String,
    pub code: WorldRegionCode,
    pub code2: String,
}

pub(super) fn load_regions() -> Vec<WorldRegion> {
    let raw_data = fs::read_to_string("data/regions.json").unwrap();
    let data: RegionData = json::from_str(raw_data.as_str()).unwrap();
    data.regions
        .into_iter()
        .map(|region_data| region_data.into())
        .collect()
}

impl From<RegionDataRegion> for WorldRegion {
    fn from(data: RegionDataRegion) -> Self {
        WorldRegion {
            name: data.name,
            code: data.code,
            code2: data.code2,
        }
    }
}

#[derive(Deserialize, Debug)]
struct RegionData {
    regions: Vec<RegionDataRegion>,
}

#[derive(Deserialize, Debug)]
struct RegionDataRegion {
    name: String,
    code: String,
    code2: String,
}
