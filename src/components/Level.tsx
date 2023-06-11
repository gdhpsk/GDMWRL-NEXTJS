import Image from 'next/image'
import React, { useState } from 'react'
import { Row, Col, Accordion, Button } from 'react-bootstrap'

interface LevelProps {
    n: number
    name: string
    creator: string,
    ytcode: string,
    verifier: string,
    id?: string
    records: [Record<any, any>],
    onClick?: Function
}

const Level: React.FC<LevelProps> = ({ n, name, creator, ytcode, records, verifier, onClick, id }: LevelProps) => {
    function openWindow() {
        window.open(`https://youtube.com/watch?v=${ytcode}`, "_blank")
    }
    return (
        <Accordion className="levelcard">
            <Accordion.Item eventKey='0'>
                <Accordion.Header onClick={async (e) => {
                    if(onClick) {
                        e.preventDefault()
                        e.stopPropagation()
                       await onClick(e,id);
                    }
                }}>
                    <div style={{display: "grid", placeItems: "center", width: "inherit"}}>
                    <div style={{width: "calc(100% - 260px + (260px - var(--thumb-width)))", marginBottom: "-180px", marginLeft: "auto", paddingLeft: "min(30px, 3vw)"}}>
                <p className="dude">{n > 150 ? "" : `${n}. `}{name}</p>&nbsp;
            <p style={{textAlign: "left", marginTop: "-10px", fontWeight: "bolder", fontSize: "min(22px, 2.5vw)"}}><span style={{"color": "gray"}}>Creators: {creator}</span></p>
            <p style={{textAlign: "left", marginTop: "0px", fontWeight: "bolder", fontSize: "min(22px, 2.5vw)"}}><span style={{"color": "gray"}}>Verifier: {verifier}</span></p>
            </div>
            <div className="thumb">
                    <Image src={`https://i.ytimg.com/vi/${ytcode.split("&t=")[0]}/mqdefault.jpg`} style={{width: "var(--thumb-width)"}} width={260} height={156} onClick={openWindow} alt="Thumbnail" />
                    <a className="play" href={`https://www.youtube.com/watch?v=${ytcode}`} target="_blank" rel={"noreferrer"}></a>
            </div>
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