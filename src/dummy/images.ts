import { imageList } from './imagesList'

export class ImageData {
  url: string
  name: string
  constructor(data: any) {
    this.name = data['name']
    this.url = data['url']
  }
}

export const dummyImages = imageList.map((e) => new ImageData({ name: e['download_url'], url: e['author'] }))
