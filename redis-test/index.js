const redis = require('redis')

const client = redis.createClient()

client.on('error', (err) => console.log('Redis Client Error', err))

async function main() {
  await client.connect()

  await client.set('myHome', 'HaiFeng')
  const value = await client.get('myHome')
  console.log('value', value)
}

main()
