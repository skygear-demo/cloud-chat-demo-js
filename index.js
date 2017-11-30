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

hook.afterMessageSent((context, message, conversation, participants) => {
  const title = conversation.title;
  const participantIds = participants.map((p) => p._id && p._id != context.userId);
  const currentUser = participants.find((p) => p._id == context.userId);
  let body = '';
  if (message.body) {
    body = currentUser.username + ": " + message.body;
  } else {
    body = currentUser.username + ":" + "sent you a file.";
  }
  const payload = {'gcm': {'notification': {'title': title, 'body': body}}}
  container.push.sendToUser(participantIds, payload);
});