# Level DB Playground 

Mock API written in NodeJS with [LevelDB](https://github.com/Level/level) for local development. 
Useful for offline development or working in areas without reliable network connections.

## user/auth

### POST

Authenticate an existing user with username & password. Returns an authentication key to be used in the `authorization` header of asset requests.

#### example calls

```js

fetch('http://localhost:5000/auth', {
	method: 'POST',
	headers: {
		'content-type': 'application/json'
	},
	body: JSON.stringify({
		username: 'thubilla',
		password: 'secret'
	})
})
```

```sh
curl -i http://localhost:5000/auth -X POST -H "Content-type: application/json" -d '{ "username": "thubilla", "password": "secret" }'
```

## user/create

### POST

Create a new user with username & password. Returns authorization token.

#### example calls

```js

fetch('http://localhost:5000/create', {
	method: 'POST',
	headers: {
		'content-type': 'application/json'
	},
	body: JSON.stringify({
		username: 'dsetiadi',
		password: 'supersecret'
	})
})
```

```sh
curl -i http://localhost:5000/create -X POST -H "Content-type: application/json" -d '{ "username": "dsetiadi", "password": "supersecret" }'
```

## assets/

### GET

Request a collection of records (mecha gifs). Requires an authentication token passed in as a header or an URL parameter.

#### example calls

```js
fetch('http://localhost:5000/assets?token=<secret-token>')
```

```sh
curl -i http://localhost:5000/assets -H "Authentication: Bearer <secret-token>"
```

## assets/:id

Request a specific record (mecha gif). Requires an authentication token passed in as a header or an URL parameter.

```js
fetch('http://localhost:5000/assets/yDwOH0MVWY61a?token=<secret-token>')
```

```sh
curl -i http://localhost:5000/assets/yDwOH0MVWY61a -H "Authentication: Bearer <secret-token>"
```
