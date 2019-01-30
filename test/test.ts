import { Slack, Post, Invocation } from '../index';
const slackbot = new Slack.Bot('GAS-Bot', PropertiesService.getScriptProperties().getProperty('SLACK_BOT_TOKEN') as string);
const channel = PropertiesService.getScriptProperties().getProperty('SLACK_CHANNEL') as string;

function test_Bot_post() {
    const post = slackbot.post(channel,
        {
            title: "@ts-module-for-gas/gas-slack:#test_Bot_post",
            text: "下記を確認して下さい",
            fallback: "This is a fallback message",
            callback_id: "test_Bot_post",
            color: "black",
            attachment_type: "default",
            actions: [
                {
                    name: "SelectiveAction",
                    text: "アップデート",
                    type: "button",
                    value: "update"
                },
                {
                    name: "SelectiveAction",
                    text: "リプライ",
                    type: "button",
                    value: "reply"
                },
                {
                    name: "SelectiveAction",
                    text: "デストロイ",
                    type: "button",
                    value: "destroy",
                    confirm: {
                        title: "本当に削除しますか？",
                        text: "本当にこの投稿を削除しますか？",
                        ok_text: "はい",
                        dismiss_Text: "いいえ"
                    }
                }
            ]
        }
    );
}
function doPost(e: any) {
    console.log(e.parameter.payload);
    return Slack.handleInvocation(e.parameter.payload, (invocation: Invocation, post: Post) => {
        const message = invocation.original_message;
        switch (invocation.actions[0].value) {
            case 'update':
                if (message.attachments) {
                    message.attachments[0].text = message.attachments[0].text + `\n ✅ <@${invocation.user.id}> updated!!`;
                    message.attachments[0].actions = undefined;
                }
                break;
            case 'reply':
                post.reply('replyです');
                return invocation.original_message;
            case 'destroy':
                post.destroy();
                return invocation.original_message;
            default:
                break;
        }
        return message;
    })
}
function doGet(e: any) {
    console.log(e);
    return ContentService.createTextOutput(JSON.stringify(e));
}
