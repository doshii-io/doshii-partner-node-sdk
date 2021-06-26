# Doshii partner node SDK
TypeScript wrapper for the Doshii Partner API.

All the API s are part of the main `Doshii` class, which can be invoked as required and return promises. The `Doshii` constructor accepts credentials and thereafter used for all the API calls behind the scenes. 

```
import Doshii, {LogLevel} from 'doshii-sdk'

const options = {
	// required when using the bulk data API
	appId: 'myAppID';
	// Are you using the sandbox environment, defaults to false
	sandbox: true;
	// Defaults to 3 
	apiVersion: 3;
	// Defaults to WARN 
	logLevel: LogLevel.INFO;
	// Heartbeat interval for websocket, defaults to 30 seconds
	pingInterval: 30;
}
const doshii = new Doshii('myClientId', 'myClientSecret', options)
```
