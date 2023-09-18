export const thumbnails = {
        get: (obj: any) => {
            switch(obj?.type) {
                case 'youtube':
                  return `https://i.ytimg.com/vi/${obj?.value}/mqdefault.jpg`
              case 'custom': 
                    return obj?.value
              default: 
                    return undefined
            }
        }
}