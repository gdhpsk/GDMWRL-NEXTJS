
interface listInterface {
    name: string,
    percent: [string, string],
    listpercent?: boolean,
    deleted?: boolean,
    verification?: boolean,
    screenshot: boolean,
    link: string,
    hertz: number
}

interface levelsInterface {
    id?: string,
    name: string,
    ytcode: string,
    host: string,
    verifier: string,
    position: number,
    list: listInterface[]
}

class Level {
    id?: string
    name: string = ""
    ytcode!: URL
    host: string = ""
    verifier: string = ""
    position: number = 0
    list: listInterface[] = []
    constructor(obj: levelsInterface) {
        this.id = obj.id
        this.name = obj.name
        this.ytcode = new URL(`https://youtube.com/watch?v=${obj.ytcode}`)
        this.host = obj.host
        this.verifier = obj.verifier
        this.position = obj.position
        this.list = obj.list 
    }
    get level() {
        return {
            id: this.id,
            name: this.name,
            ytcode: this.ytcode.searchParams.get("v"),
            host: this.host,
            verifier: this.verifier,
            position: this.position,
            list: this.list
        }
    }
    static async getValues(db: any): Promise<Level[]> {
   let levels =  await db.ref("levels").get()
   let levs: Level[] = Object.entries(levels.val()).map((e) => {
    return new Level({
      id: e[0],
      ...e[1] as levelsInterface
    })
   })
   return levs
    }
}

export default Level