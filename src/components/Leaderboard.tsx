import React, { useState } from 'react'
import { Row, Col, Accordion, Button } from 'react-bootstrap'
import Swal from 'sweetalert2'
import styles from "@/styles/Leaderboard.module.css"
import withReactContent from 'sweetalert2-react-content'

interface LeaderboardProps {
    name: string,
    records: Array<any>,
    completions: Array<any>,
    extralist: Array<any>,
    screenshot: Array<any>,
    nationality: string,
    socials: Array<any>,
    points: number,
    levels: Array<any>
    bywrs: Boolean
}

const Level: React.FC<LeaderboardProps> = ({ name, socials, nationality, points, levels, bywrs, records, completions, extralist, screenshot }: LeaderboardProps) => {
    function display() {
        let generateHTML = (list: Array<any>) => {
            list.sort((a: any, b: any) => a?.name?.localeCompare(b?.name))
            list.sort((a: any, b: any) => levels?.find((j: any) => j.name == a.name)?.position ?? (1+levels.length) - levels.find((j: any) => j.name == b.name)?.position ??  (1+levels.length))
            if(list[0] == "none" || !list.length) {
                return <p className='white' style={{textAlign: "center"}}>none</p>
            }
            let pos = (e: any) => levels?.find((j: any) => j.list.find((x:any) => x._id.toString() == e.id.toString()))?.position
            let txt = <ul>
            {list.map(e => <li key={e.id} className="white" style={{fontSize: "14px", textAlign: "left"}}>{e.verification ? "(V) " : ""}{e.name} <span style={{color: "#ABABAB"}}>by {e.host}</span> {e.percent}% ({pos(e) ? `#${pos(e)}, ` : ""}{e.hertz}fps)</li>)}
            </ul>
            return txt
        }
        let socialsarr = []
        for(let i = 0; i < socials?.length ?? 0; i++) {
            for(const item in socials[i]) {
                let ok = socials[i]
                let title = `${item.charAt(0).toUpperCase()}${item.slice(1)}`
                socialsarr.push(<p className={`white ${styles.socials}`} style={{marginLeft: "31px"}}>{title}: {item == "discord" ? ok[item][0] : <a href={ok[item]}>{title} Link</a>}{item == "discord" && ok[item]?.[1] ? <span> / <a href={ok[item][1]}>Discord Server</a></span> :""}</p>)
            }
        }
        if(!socialsarr.length) {
            socialsarr.push(<p className={`white`} style={{textAlign: "center"}}>none</p>)
        }
        const mySwal = withReactContent(Swal)
        mySwal.fire({
            background: "#333333",
            confirmButtonColor: 'black',
            html: <><h2 className="white">Mobile World Records:</h2>{generateHTML(records)}<h2 className="white">Completions:</h2>{generateHTML(completions)}<h2 className="white">Extralist:</h2>{generateHTML(extralist)}<h2 className="white">Screenshot:</h2>{generateHTML(screenshot)}<h2 className="white">Socials:</h2>{socialsarr}</>
        })
    }
    return (
        <div style={{display: "grid", placeItems: "center"}}>
            <p className={"white " + styles.entry} onClick={async () => display()}><b>{nationality ? <abbr title={nationality}><img width="24" height="18" alt="flag" className={styles.nationality} src={`/nationalities/${nationality}.svg`} loading={"lazy"}/></abbr> : ""} {name} ({points} {bywrs ? "record" : "point"}{points == 1 ? "" : "s"})</b></p>
        </div>
    )
}

export default Level