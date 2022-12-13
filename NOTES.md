# Notes

## PWA Notifications

**Note**: we probably want to store an array of push API endpoints for a user somewhere in a table, in case they register on more than one browser/device!

src: https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications

codelabs: https://codelabs.developers.google.com/codelabs/push-notifications/index.html?index=..%2F..%2Findex#0

0. Check support & permission first

    ```javascript
    // main.js
    if ('Notification' in window && navigator.serviceWorker) {
      // Display the UI to let the user toggle notifications
    }

    if (Notification.permission === "granted") {
      /* do our magic */
    } else if (Notification.permission === "blocked") {
    /* the user has previously denied push. Can't reprompt. */
    } else {
      /* show a prompt to the user */
    }
    ```


1. Request permission

    ```javascript
    // main.js
    Notification.requestPermission(function(status) {
        console.log('Notification permission status:', status);
    });
    ```

2. Showing the message

    ```javascript
    // main.js
    function displayNotification() {
      if (Notification.permission == 'granted') {
        navigator.serviceWorker.getRegistration().then(function(reg) {
          var options = {
            body: 'Here is a notification body!',
            icon: 'images/example.png',
            vibrate: [100, 50, 100],
            data: {
              dateOfArrival: Date.now(),
              primaryKey: 1
            }
          };
          reg.showNotification('Hello world!', options);
          // options: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
        });
      }
    }

    // notification generator: https://tests.peter.sh/notification-generator/
    ```

3. Add actions

    ```javascript
    // main.js
    function displayNotification() {
      if (Notification.permission == 'granted') {
        navigator.serviceWorker.getRegistration().then(function(reg) {
          var options = {
            // ...
            actions: [
              {action: 'explore', title: 'Explore this new world',
                icon: 'images/checkmark.png'},
              {action: 'close', title: 'Close notification',
                icon: 'images/xmark.png'},
            ]
          };
          reg.showNotification('Hello world!', options);
        });
      }
    }

    // can check for max actions in `Notification.maxActions`
    ```

4. Listen for events in service worker land

    ```javascript
    // sw.js
    self.addEventListener('notificationclose', function(e) {
      var notification = e.notification;
      var primaryKey = notification.data.primaryKey;

      console.log('Closed notification: ' + primaryKey);
    });

    self.addEventListener('notificationclick', function(e) {
      var notification = e.notification;
      var primaryKey = notification.data.primaryKey;
      var action = e.action;

      if (action === 'close') {
        notification.close();
      } else {
        clients.openWindow('http://www.example.com');
        notification.close();
      }
    });
    ```

***

## PWA Push API

### Summary

#### On the client

* Subscribe to the push service
* Send the subscription object to the server

#### On the server

* Generate the data that we want to send to the user
* Encrypt the data with the user public key
* Send the data to the endpoint URL with a payload of encrypted data.

#### The message is routed to the user's device. This wakes up the browser, which finds the correct service worker and invokes a "push" event. Now, on the client:

* Receive the message data (if there is any) in the "push" event
* Perform some custom logic in the push event
* Show a notification

### Implementation

```javascript
// sw.js
self.addEventListener('push', function(e) {
  // same as regular notification, but now inside of push event
  var options = {
    body: 'This notification was generated from a push!',
    icon: 'images/example.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {action: 'explore', title: 'Explore this new world',
        icon: 'images/checkmark.png'},
      {action: 'close', title: 'Close',
        icon: 'images/xmark.png'},
    ]
  };
  e.waitUntil( // extend lifetime of event until the async notification operation completes
    self.registration.showNotification('Hello world!', options)
  );
});
```

1. Check for existing subscription. **Do this every time someone accesses the app to ensure everything is in sync.**

    ```javascript
    // main.js
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').then(function(reg) {
        console.log('Service Worker Registered!', reg);

        reg.pushManager.getSubscription().then(function(sub) {
          if (sub === null) {
            // Update UI to ask user to register for Push
            console.log('Not subscribed to push service!');
          } else {
            // We have a subscription, update the database
            console.log('Subscription object: ', sub);
          }
        });
      })
      .catch(function(err) {
        console.log('Service Worker registration failed: ', err);
      });
    }
    ```

2. If user says they want notifications, do this:

    ```javascript
    function subscribeUser() {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function(reg) {
          reg.pushManager.subscribe({
            userVisibleOnly: true
          }).then(function(sub) {
            console.log('Endpoint URL: ', sub.endpoint);
          }).catch(function(e) {
            if (Notification.permission === 'denied') {
              console.warn('Permission for notifications was denied');
            } else {
              console.error('Unable to subscribe to push', e);
            }
          });
        })
      }
    }
    ```

    Notice we are passing a flag named userVisibleOnly to the subscribe method. By setting this to true, the browser ensures that every incoming message has a matching (and visible) notification.

3. Receiving data in the service worker from the push event

    ```javascript
    // sw.js
    self.addEventListener('push', function(e) {
      var body;
      if (e.data) {
        body = e.data.text();
      } else {
        body = 'Push message no payload';
      }
      var options = {
        body: body,
        icon: 'images/notification-flat.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        },
        actions: [
          {action: 'explore', title: 'Explore this new world',
            icon: 'images/checkmark.png'},
          {action: 'close', title: 'I don\'t want any of this',
            icon: 'images/xmark.png'},
        ]
      };
      e.waitUntil(
        self.registration.showNotification('Push Notification', options)
      );
    });
    ```

4. Sending data from the server

    Note: maybe use https://www.npmjs.com/package/web-push (mozilla nodejs web push library)

    ```javascript
    // server.js
    var webPush = require('web-push');
    var pushSubscription = {"endpoint":"https://android.googleapis.com/gcm/send/f1LsxkKphfQ:APA91bFUx7ja4BK4JVrNgVjpg1cs9lGSGI6IMNL4mQ3Xe6mDGxvt_C_gItKYJI9CAx5i_Ss6cmDxdWZoLyhS2RJhkcv7LeE6hkiOsK6oBzbyifvKCdUYU7ADIRBiYNxIVpLIYeZ8kq_A",
    "keys":{"p256dh":"BLc4xRzKlKORKWlbdgFaBrrPK3ydWAHo4M0gs0i1oEKgPpWC5cW8OCzVrOQRv-1npXRWk8udnW3oYhIO4475rds=", "auth":"5I2Bu2oKdyy9CwL8QVF0NQ=="}};
    var payload = 'Here is a payload!';
    var options = {
      gcmAPIKey: 'AIzaSyD1JcZ8WM1vTtH6Y0tXq_Pnuw4jgj_92yg',
      TTL: 60
    };
    webPush.sendNotification(
      pushSubscription,
      payload,
      options
    );
    ```

***

## Best Practices

**Note: read more about this on the docs**

### Grouping messages

The notification object includes a tag attribute that is the grouping key. When creating a notification with a tag and there is already a notification with the same tag visible to the user, the system automatically replaces it without creating a new notification. For example:

```javascript
// sw.js
registration.showNotification('2 new messages', {
  body: '2 new Messages!',
  tag: 'id1',
  renotify: true // renotify them anyways, if false and another notification has the same tag it will be a silent notification
});
```

### Don't bother if the user is already on the site

```javascript
self.addEventListener('push', function(e) {
  clients.matchAll().then(function(c) {
    if (c.length === 0) {
      // Show notification
      e.waitUntil(
        self.registration.showNotification('Push notification')
      );
    } else {
      // Send a message to the page to update the UI
      console.log('Application is already open!');
    }
  });
});
```
