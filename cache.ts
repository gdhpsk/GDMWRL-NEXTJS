class cache extends Map {
    super() {}
    add(key: any, value: any, ttl?: number) {
        this.set(key, value)
        if(ttl) {
            setTimeout(() => this.delete(key), ttl)
        }
    }
}

let realCache = new cache()

export default realCache