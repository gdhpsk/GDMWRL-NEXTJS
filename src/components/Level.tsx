import React, { useState } from 'react'
import { Row, Col, Accordion, Button } from 'react-bootstrap'

interface LevelProps {
    n: number
    name: string
    creator: string,
    ytcode: string,
    records: [Record<any, any>]
}

const Level: React.FC<LevelProps> = ({ n, name, creator, ytcode, records }: LevelProps) => {
    function openWindow() {
        window.open(`https://youtube.com/watch?v=${ytcode}`, "_blank")
    }
    return (
        <Accordion className="levelcard">
            <Accordion.Item eventKey='0'>
                <Accordion.Header>
                    <img src={`https://i.ytimg.com/vi/${ytcode}/mqdefault.jpg`} width={"200px"} onClick={openWindow} alt="Thumbnail"></img>
                    <div className="info-card">
                        <p className="dude"><b><b>{n > 150 ? "" : `${n}. `}{name}</b></b></p>&nbsp;
                        <br></br>
                        <b><b><span style={{"color": "gray", "float": "left", "textAlign": "left"}}>{creator}</span></b></b>
                    </div>
                </Accordion.Header>
                <Accordion.Body>
                    <div id="level-records">
                        {records.find(e => e.percent.includes("100")) ? <h5 style={{"fontSize": "30px" }} className="white title"><i>Completions</i></h5> : ""}
                    {records[0].name == "" ? "" : records.filter(e => e.percent.includes("100")).map(e => {
                            return (
                            <p className="white"  key={e.name}>
                                <b>[{e.verification ? "V/" : ""}{e.hertz}hz] {e.listpercent && n < 76 ? "(List%) " : ""}{e.name} - {e.percent[0]}% {e.percent[1] ? <i>{e.percent[1]}</i> : ""}<a href={e.link} target={"_blank"} rel={"noreferrer"}>{e.screenshot ? "(Screenshot)" : "(Link)"}</a>&nbsp;</b>
                            </p>
                            )
                        })}

{records.find(e => !e.percent.includes("100")) ? <h5 style={{"fontSize": "30px" }} className="white title"><i>Mobile World Records</i></h5> : ""}
                        {records[0].name == "" ? <h5 style={{"fontSize": "10px" }} className="white"><b>(No World Records registered. The minimum requirement for a World Record is 10%.)</b></h5> : records.filter(e => !e.percent.includes("100")).map(e => {
                            return (
                            <p className="white" key={e.name}>
                                <b>[{e.hertz}hz] {e.listpercent ? "(List%) " : ""}{e.name} - {e.percent[0]}% {e.percent[1] ? <i>{e.percent[1]}%</i> : ""}<a href={e.link} target={"_blank"} rel={"noreferrer"}>{e.screenshot ? "(Screenshot)" : "(Link)"}</a>&nbsp;</b>
                            </p>
                            )
                        })}
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}

export default Level