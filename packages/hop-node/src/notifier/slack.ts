import { Notifier } from './interfaces'
import { WebClient } from '@slack/web-api'
import { slackAuthToken, slackChannel, slackUsername } from 'src/config'

class SlackClient implements Notifier {
  private static instance: SlackClient
  client: WebClient
  channel: string
  label: string

  constructor (label: string = '') {
    if (!slackAuthToken) {
      return
    }
    this.client = new WebClient(slackAuthToken)
    this.channel = slackChannel
    this.label = label
  }

  async sendMessage (message: string) {
    if (!this.client) {
      return
    }
    if (this.label) {
      message = `${this.label}\n${message}`
    }
    try {
      await this.client.chat.postMessage({
        channel: this.channel,
        text: message,
        username: slackUsername,
        icon_emoji: ':rabbit'
      })
    } catch (err) {
      console.error('notifier error:', err.message)
    }
  }

  async error (message: string) {
    const icon = '❌'
    return this.sendMessage(`${icon} ${message}`)
  }

  async info (message: string) {
    const icon = 'ℹ️'
    return this.sendMessage(`${icon} ${message}`)
  }

  async log (message: string) {
    const icon = 'ℹ️'
    return this.sendMessage(`${icon} ${message}`)
  }

  async success (message: string) {
    const icon = '✅'
    return this.sendMessage(`${icon} ${message}`)
  }

  async warn (message: string) {
    const icon = '⚠️'
    return this.sendMessage(`${icon} ${message}`)
  }
}

export default SlackClient
