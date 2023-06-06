interface socials {
    discord?: [string, string | undefined],
    youtube?: string,
    twitter?: string,
    twitch?: string
}

interface records {
    name: string,
    hertz: number,
    percent: number,
    verification?: boolean
}


interface leaderboard {
    nationality?: string,
    minus?: number,
    socials?: Array<socials> | Array<any>,
    records: Array<Omit<records, "verification"> | any>,
    completions: Array<records | any>,
    extralist: Array<records | any>,
    screenshot: Array<Omit<records, "verification"> | any>
}

class Leaderboard {
    nationality?: string
    minus?: number
    socials?: Array<socials> | Array<any>
    records: Array<Omit<records, "verification"> | any>
    completions: Array<records | any>
    extralist: Array<records | any>
    screenshot: Array<Omit<records, "verification"> | any>
    constructor(obj: leaderboard) {
        this.nationality = obj.nationality
        this.minus = obj.minus
        this.socials = obj.socials
        this.records = obj.records
        this.completions = obj.completions
        this.extralist = obj.extralist
        this.screenshot = obj.screenshot
    }
    get leaderboard() {
        return {
            nationality: this.nationality,
            minus: this.minus,
            socials: this.socials,
            records: this.records,
            completions: this.completions,
            extralist: this.extralist,
            screenshot: this.screenshot
        }
    }
}