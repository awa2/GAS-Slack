# GAS-Slack
Slack module for GAS that written by TypeScript

## Usage
```TypeScript
import {Slack, Invocation } from '../index';

const slackbot = new Slack.Bot('GAS-Bot', PropertiesService.getScriptProperties().getProperty('SLACK_BOT_TOKEN') as string);
const channel = PropertiesService.getScriptProperties().getProperty('SLACK_CHANNEL') as string;

function test_Bot_post() {
    const post = slackbot.post(channel,
        {
            title: "Approval Request",
            text: "Your approval is requested",
            fallback: "This is a fallback message",
            callback_id: "test_Bot_post",
            color: "black",
            attachment_type: "default",
            actions: [
                {
                    name: "SelectiveAction",
                    text: "Approve",
                    type: "button",
                    value: "approve"
                }
            ]
        }
    );
}
function doPost(e: any) {
    return Slack.handleInvocation(JSON.parse(e.parameter.payload), (invocation: Invocation, post: Post) => {
        const message = invocation.original_message;
        switch (invocation.actions[0].value) {
            case 'approve':
                if (message.attachments) {
                    message.attachments[0].text = message.attachments[0].text + `\n ✅ <@${invocation.user.id}> approved!`;
                    message.attachments[0].actions = undefined;
                }
                break;
            default:
                break;
        }
        return message;
    })
}

```
