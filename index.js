/**
 * Copyright 2017 Oursky Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const hook = require('skygear-chat/hook');
const skygearCloud = require('skygear/cloud');
const container = new skygearCloud.CloudCodeContainer();
container.apiKey = skygearCloud.settings.apiKey;
container.endPoint = skygearCloud.settings.skygearEndpoint + '/';

hook.afterMessageSent((message, conversation, participants, context) => {
  const title = conversation.title;
  const participantIds = participants.map((p) => p._id && p._id != context.userId);
  const currentUser = participants.find((p) => p._id == context.userId);
  let body = '';
  if (message.body) {
    body = currentUser.username + ": " + message.body;
  } else {
    let fileMessage = "a file";
    if (message.attachment) {
      if (message.attachment.contentType.startsWith("audio/")) {
        fileMessage = "an audio file";
      }
      if (message.attachment.contentType.startsWith("image/")) {
        fileMessage = "an image file"
      }
    }
    body = currentUser.username + " sent you " + fileMessage + ".";
  }

  const apnsPayload = {
    'aps': {
      'alert':
        {'title':title,
         'body': body}
      },
    'from': 'skygear',
    'operation': 'notification'
  };
  const gcmPayload = {
    'notification': {
      'title': title,
      'body': body
    }
  }
  const payload = {'gcm': gcmPayload, 'apns': apnsPayload};
  container.push.sendToUser(participantIds, payload);
});
