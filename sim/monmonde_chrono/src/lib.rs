use std::{
    fmt,
    ops::{Add, Div, Mul, Neg, Sub},
    result::Result,
    str::FromStr,
};

use once_cell::{sync::Lazy, sync_lazy};
use regex::Regex;

type DayOfEpoch = i32;

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub struct Date {
    day_of_epoch: DayOfEpoch,
}

type MinuteOfDay = i32;

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub struct Time {
    minute_of_day: MinuteOfDay,
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct DateTime {
    date: Date,
    time: Time,
}

type DurationMinutes = i32;

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub struct Duration {
    minutes: DurationMinutes,
}

static MIN_YEAR: i32 = 1;
static MIN_DAY: i32 = 1;
static MIN_HOUR: i32 = 0;
static MAX_HOUR: i32 = 23;
static MIN_MINUTE: i32 = 0;
static MAX_MINUTE: i32 = 59;

static MINUTES_PER_HOUR: i32 = 60;
static HOURS_PER_DAY: i32 = 24;
static MINUTES_PER_DAY: i32 = HOURS_PER_DAY * MINUTES_PER_HOUR;
static DAYS_PER_YEAR: i32 = 60;
static MINUTES_PER_YEAR: i32 = DAYS_PER_YEAR * MINUTES_PER_DAY;

impl Date {
    pub fn of(year: i32, day: i32) -> Result<Date, ()> {
        if year < MIN_YEAR || day < MIN_DAY || day > DAYS_PER_YEAR {
            return Err(());
        }
        Ok(Date {
            day_of_epoch: DAYS_PER_YEAR * (year - 1) + day,
        })
    }

    pub fn year0(&self) -> i32 {
        self.day_of_epoch / DAYS_PER_YEAR
    }

    pub fn year(&self) -> i32 {
        self.year0() + 1
    }

    pub fn day(&self) -> i32 {
        self.day_of_epoch - DAYS_PER_YEAR * self.year0()
    }
}

impl fmt::Display for Date {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}/{}", self.day(), self.year())
    }
}

impl Time {
    pub fn of(hour: i32, minute: i32) -> Result<Time, ()> {
        if hour < MIN_HOUR || hour > MAX_HOUR || minute < MIN_MINUTE || minute > MAX_MINUTE {
            return Err(());
        }
        Ok(Time {
            minute_of_day: MINUTES_PER_HOUR * hour + minute,
        })
    }

    pub fn hour(&self) -> i32 {
        self.minute_of_day / MINUTES_PER_HOUR
    }

    pub fn minute(&self) -> i32 {
        self.minute_of_day - MINUTES_PER_HOUR * self.hour()
    }
}

impl fmt::Display for Time {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}:{:02}", self.hour(), self.minute())
    }
}

impl DateTime {
    pub fn of(year: i32, day: i32, hour: i32, minute: i32) -> Result<DateTime, ()> {
        Ok(DateTime {
            date: Date::of(year, day)?,
            time: Time::of(hour, minute)?,
        })
    }
}

impl fmt::Display for DateTime {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}, {}", self.time, self.date)
    }
}

// SAFETY: use checked_sub and checked_add with overflow detection
impl Duration {
    pub fn minutes(minutes: i32) -> Duration {
        Duration { minutes }
    }

    pub fn hours(hours: i32) -> Duration {
        Duration::minutes(MINUTES_PER_HOUR * hours)
    }

    pub fn days(days: i32) -> Duration {
        Duration::minutes(MINUTES_PER_DAY * days)
    }

    pub fn years(years: i32) -> Duration {
        Duration::minutes(MINUTES_PER_YEAR * years)
    }

    pub fn zero() -> Duration {
        Duration::minutes(0)
    }

    pub fn num_years(&self) -> i32 {
        self.minutes / MINUTES_PER_YEAR
    }

    pub fn num_days(&self) -> i32 {
        self.minutes / MINUTES_PER_DAY
    }

    pub fn num_hours(&self) -> i32 {
        self.minutes / MINUTES_PER_HOUR
    }

    pub fn num_minutes(&self) -> i32 {
        self.minutes
    }
}

impl Add for Duration {
    type Output = Duration;
    fn add(self, rhs: Duration) -> Duration {
        Duration::minutes(self.minutes + rhs.minutes)
    }
}

impl Div<i32> for Duration {
    type Output = Duration;
    fn div(self, rhs: i32) -> Duration {
        Duration::minutes(self.minutes / rhs)
    }
}

impl Mul<i32> for Duration {
    type Output = Duration;
    fn mul(self, rhs: i32) -> Duration {
        Duration::minutes(self.minutes * rhs)
    }
}

impl Neg for Duration {
    type Output = Duration;
    fn neg(self) -> Duration {
        Duration::minutes(-self.minutes)
    }
}

impl Sub for Duration {
    type Output = Duration;
    fn sub(self, rhs: Duration) -> Duration {
        Duration::minutes(self.minutes - rhs.minutes)
    }
}

impl Add<Duration> for DateTime {
    type Output = DateTime;
    fn add(self, rhs: Duration) -> DateTime {
        let days = rhs.num_days();
        let minutes = rhs.num_minutes() - MINUTES_PER_DAY * days;
        DateTime {
            date: Date {
                day_of_epoch: self.date.day_of_epoch + days,
            },
            time: Time {
                minute_of_day: self.time.minute_of_day + minutes,
            },
        }
    }
}

static DURATION_RE: Lazy<Regex> = sync_lazy! {
    Regex::new(r"(?:(?P<y>\d+)y)?(?:(?P<d>\d+)d)?(?:(?P<h>\d+)h)?(?:(?P<m>\d+)m)?").unwrap()
};

impl FromStr for Duration {
    type Err = ();
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let caps = DURATION_RE.captures(s).ok_or(())?;

        let y = match &caps.name("y") {
            Some(ym) => ym.as_str().parse::<i32>().map_err(|_| ())?,
            None => 0,
        };
        let d = match &caps.name("d") {
            Some(dm) => dm.as_str().parse::<i32>().map_err(|_| ())?,
            None => 0,
        };
        let h = match &caps.name("h") {
            Some(hm) => hm.as_str().parse::<i32>().map_err(|_| ())?,
            None => 0,
        };
        let m = match &caps.name("m") {
            Some(mm) => mm.as_str().parse::<i32>().map_err(|_| ())?,
            None => 0,
        };

        if y + d + h + m == 0 {
            return Err(());
        }

        Ok(Duration::minutes(
            MINUTES_PER_YEAR * y + MINUTES_PER_DAY * d + MINUTES_PER_HOUR * h + m,
        ))
    }
}
