import {useState, useEffect} from "react"

export default function Home() {
  let [array, setArray] = useState<Array<Record<any, any>>>()
  useEffect(() => {
      (async () => {
        let levels = await fetch("https://gdmobilewrlist.gq/mods/api")
        let json = await levels.json()
        setArray(Object.values(json))
      })()
  })
  return (
    <div>
    <p>Hello there lol! Here are all the levels:</p>
    <br></br>
    {array?.map(e  => {
      return (
        <p key={e._id}>{e.name}</p>
      )
    })}
    </div>
  )
}
