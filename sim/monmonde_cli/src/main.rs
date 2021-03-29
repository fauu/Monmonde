use std::str::FromStr;

use colored::*;
use rustyline::error::ReadlineError;
use rustyline::Editor;

use monmonde_chrono::Duration;
use monmonde_core::Sim;

enum CmdResult {
    UnknownCmd,
    ExitRequest,
    Ok,
    Msg(String),
}

fn main() {
    println!("Welcome to {}", "Monmonde Sim CLI".bold().green());

    let mut sim = Sim::new();
    sim.init();

    let mut rl = Editor::<()>::new();
    loop {
        let readline = rl.readline("» ");
        match readline {
            Ok(raw_line) => {
                rl.add_history_entry(raw_line.as_str());

                let line = raw_line.trim().to_lowercase();
                let mut segs_it = line.split_ascii_whitespace();
                if let Some(cmd) = segs_it.next() {
                    match exec_cmd(cmd, &mut segs_it, &mut sim) {
                        CmdResult::UnknownCmd => println!("Unknown command"),
                        CmdResult::ExitRequest => break,
                        CmdResult::Ok => (),
                        CmdResult::Msg(msg) => println!("{}", msg),
                    }
                }
            }
            Err(ReadlineError::Interrupted) | Err(ReadlineError::Eof) => break,
            Err(err) => {
                eprintln!("Error: {:?}", err);
                break;
            }
        }
    }
}

fn exec_cmd<'a>(
    cmd: &str,
    args_it: &mut impl Iterator<Item = &'a str>,
    sim: &mut Sim,
) -> CmdResult {
    match cmd {
        "exit" => CmdResult::ExitRequest,

        "advance" => match args_it.next() {
            Some(duration) => {
                sim.advance(Duration::from_str(duration).unwrap()).unwrap();
                CmdResult::Ok
            }
            _ => CmdResult::Msg("Usage: advance [Ny][Nd][Nh][Nm]".into()),
        },

        "date" => CmdResult::Msg(format!("{}", sim.datetime())),

        "dump" => {
            sim.dump();
            CmdResult::Ok
        }

        _ => CmdResult::UnknownCmd,
    }
}
