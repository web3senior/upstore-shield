import Web3 from 'web3'
import ABI from './../abi/upstore.json'
import styles from './../scss/content.module.scss'
const CONTRACT_ADDR = `0x6d80FC6430711406494389024174A00fB063A0d5`
/**
 * UPStore class
 */
class UPStore {
  constructor() {
    this.hasMeta = false
    this.host = window.location.origin
    this.web3 = new Web3(`https://42.rpc.thirdweb.com`)
  }

  /**
   * Check if the Upstore metadata exists
   */
  checkMeta() {
    if (document.querySelector('meta[name="upstore:app:id"]')) {
      this.hasMeta = true
      this.appId = document.querySelector('meta[name="upstore:app:id"]').content
      console.log(this.appId)

      this.getApp().then(async (res) => {
        let data = await this.fetchIPFS(res.metadata)
        this.data = data
        this.showMessage()
      })
    }
  }

  async fetchIPFS(CID) {
    try {
      const response = await fetch(`https://api.universalprofile.cloud/ipfs/${CID}`)
      if (!response.ok) throw new Response('Failed to get data', { status: 500 })
      const json = await response.json()
      // console.log(json)
      return json
    } catch (error) {
      console.error(error)
    }
  }

  async getApp() {
    const UpstoreContract = new this.web3.eth.Contract(ABI, CONTRACT_ADDR)
    return await UpstoreContract.methods.getApp(this.appId).call()
  }

  showMessage() {
    console.log(this.data)
    console.log(this.data.url, this.host)
    console.log(this.data.logo)
    // Change to ===
    if (this.data.url !== this.host) {
      let badge = document.createElement('div')
      badge.classList = styles['badge']
      badge.onclick = () => {
        popup.classList.toggle(styles['show-popup'])
        cover.classList.toggle(styles['show-popup'])
      }

      let cover = document.createElement('div')
      cover.classList.add(styles['cover'], styles['animate'], styles['fade'])

      let popup = document.createElement('ul')
      popup.classList.add(styles['popup'], styles['animate'], styles['fade'])
      popup.innerHTML = `
    <li><img src="${this.data.logo}"/></li>
    <li><b>${this.data.name}</b></li>
    <li><a target="_blank" href="https://universalprofile.store/">${this.appId.slice(0, 4)}...${this.appId.slice(this.appId.length - 4, this.appId.length)}</a></li>
    <li><div class="${styles['issecure-message']}">This dApp is secure</div></li>`

      let img = document.createElement('img')
      img.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAyCAYAAAATIfj2AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAUdSURBVHgB3ZpvbBNlHMe/Hd12lbG1Km5LCL060ICwbqDL1MAmMaiJEZQ3JiYOfWVIDKjv9MXqO01I5gtjgi/YjH+ILxBhMxmJuGwDszDHIBomla6duBXE2ZYtWWcG5/O7623X9rpen7t2hU/yzfXaJ71+7/frc7/nd2eDdTiZ9jJ5mUSmhsR7zpRxUaZQYnuRqT+xDaEIoB97kKmPSTKpUaY2KCej4IhMHUwRmDeip04UyBhFxJdHI6nyIT1lLaOVKQhAKrDomA2wmEMApBWWDxbxCQCpSNQBk3QBkIpMneDEB0AqUmWM1KplzLTDAtweL7zbnsfjTXswPz+LyL9hWEAzU4xpKPUDm85gEcrMwo0gVKDpqX1YL3plQ8R9qyths5UwQ1MYvzqCM6ePIGreXCOUKmMRPUNkRkSOkIn6xufwyKanF01oUQ1pCU/6cW7ga9kgpzky06h9I9WQDzmkGpmgH//Ek/tQU7sB5cLqjGP1DGkJMlMjw6dw4XwPcsTH9KG6ozUkQqnJRBiAUmrnM23LmtCSzZAKpeSF4R6c6T0Cg1CR60lskyYFunjuNfINTlcNXn39I9jtZTBKaVk5M2TLOs7hWIOHN2zHeMBwGgpMcShVO7SnrA0G2dqwG/lm85bWXIZTMOSaTzVEkRFRRAiOilyGkxm53lMN7cHdj5xh2gjd7cgeyJC6VDZMLHoDRYicdmSoBfcOXjssmgw8bhcavTX4qT+IaCyetB+fX8CLu0X5OkSvb9ycw6+Xp7GxzolHmQaHphC79R8sQI6QCAtwVQnYVl8Ll1NI23cIdtQ/9iAeWiugeq2DmXNj6+YH4KwsY9v7UVVp/HqWBZEM5bxmn4/Pggd/IIbj3ePy6/XrKli0bsNinNlrER3inIYoIjuaa+XX2hSzKN1k7OAgGuGb5SjNiIm/ZjA8+jfc69ZkHBuf4ztpXIZi0ety2pUL6VdzZ5UDVCcKjvSvHhwK4+zQUn3mD0Tx2dHfdCMUnrwCHkqQqFJz5Xo4kLR/2X8T0egcdrV48MpLm7BrpwcRth+cyPz1FLEDb25hk4Uj7bPwlB8cRKnabk4oJwS2bKjb2LS4v7BwB2NX/oFQboe9tAR/BKbx3anfsXD7jjLAVoprk7NJ0aDae5W9hJm+xZbnSxMELSFO93wKDnrpO/eDo5NCi7v3PjhpeLzR9RAxcr4bx4/5wMEhOsJFcEAz3UTwEvIB9Rs46VcNcf2PBvu+gNVQdDj7C/LtGTUHvgcHFCEroxSfmzETHdmDaoj7VHef+Ji7ckjlx15Tra0kQ9xpF2MX2QELUo9S7eeBY+AkxCTPUGqThJoMVFW2goPJa2Py1u3JfNdjuSbJFOvPffvl+2zq5y6B6IaC3CTRdn3oz/AWFGM582foktwNqmb9OT0yGSIzXx19F7Mz0+AkxPQOdNpYpqJE+MfOyVu9SOkZGr/6C7o+f9uMGYKis3hBTG3WU9hobV4DTihSVOtRpARNrZdq6Gz/N2bTjAgxvax9Qy+p6fSOwiRVrmrsYJ1VL+t3E2qlQCn2w4nDCLJGogVQxzRkZKBltyCZMenZFw5Ir71xWPLUbbfyHpHhHrxKh4UHt1o5m1HpAiAVmTphkmKKlOmbxirtAKQV1kFYDM1+QQCFNkLHbEGeoJZXO1AQI5HEsfL2aIwWEcqfM19GOrCCT2Xth3IhNmukD8r/xFREst8jNI4I5eG/Vizd0RCh/wCg+vBfKLE9Cc7lSyr/A9gHebrODSKEAAAAAElFTkSuQmCC`

      badge.appendChild(img)
      badge.appendChild(popup)
      badge.appendChild(cover)
      document.body.appendChild(badge)
    }
  }
}

let upstore = new UPStore()
upstore.checkMeta()
