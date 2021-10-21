import { Notifier } from './interfaces'
import { WebClient } from '@slack/web-api'
import { slackAuthToken, slackChannel, slackErrorChannel, slackInfoChannel, slackLogChannel, slackSuccessChannel, slackUsername, slackWarnChannel } from 'src/config'

type MessageOptions = {
  channel: string
}

class SlackClient implements Notifier {
  private static readonly instance: SlackClient
  client: WebClient
  channel: string
  label: string

  constructor (label: string = '') {
    if (!slackAuthToken) {
      return
    }
    this.client = new WebClient(slackAuthToken)
    this.channel = slackChannel! // eslint-disable-line
    this.label = label
  }

  async sendMessage (message: string, options: Partial<MessageOptions> = {}) {
    if (!this.client) {
      return
    }
    if (this.label) {
      message = `${this.label}\n${message}`
    }
    try {
      await this.client.chat.postMessage({
        channel: options.channel ?? this.channel,
        text: message,
        username: slackUsername,
        icon_emoji: ':rabbit'
      })
    } catch (err) {
      console.error('notifier error:', err.message)
    }
  }

  async error (message: string, options: Partial<MessageOptions> = {}) {
    const icon = '❌'
    return await this.sendMessage(`${icon} ${message}`, {
      channel: options.channel ?? slackErrorChannel
    })
  }

  async info (message: string, options: Partial<MessageOptions> = {}) {
    const icon = 'ℹ️'
    return await this.sendMessage(`${icon} ${message}`, {
      channel: options.channel ?? slackInfoChannel
    })
  }

  async log (message: string, options: Partial<MessageOptions> = {}) {
    const icon = 'ℹ️'
    return await this.sendMessage(`${icon} ${message}`, {
      channel: options.channel ?? slackLogChannel
    })
  }

  async success (message: string, options: Partial<MessageOptions> = {}) {
    const icon = '✅'
    return await this.sendMessage(`${icon} ${message}`, {
      channel: options.channel ?? slackSuccessChannel
    })
  }

  async warn (message: string, options: Partial<MessageOptions> = {}) {
    const icon = '⚠️'
    return await this.sendMessage(`${icon} ${message}`, {
      channel: options.channel ?? slackWarnChannel
    })
  }
}

export default SlackClient
