import log from '../logger'
import GroupModel from '../model/group.model'
import UserModel from '../model/user.model'

export const seedGroups = [
  {
    _id: '61b20709a915de06af722bea',
    name: 'Real Madrid',
    description: 'Grupo de jugadores del Real Madrid'
  },
  {
    _id: '61b20709a915de06af722beb',
    name: 'Atlético de Madrid',
    description: 'Grupo de jugadores del Atlético de Madrid'
  },
  {
    _id: '61b20709a915de06af722bec',
    name: 'Rayo Vallecano',
    description: 'Grupo de jugadores del Rayo Vallecano'
  },
  {
    _id: '61b20709a915de06af722bef',
    name: 'Getafe',
    description: 'Grupo de jugadores del Getafe'
  },
]

export const seedUsers = [
  {
    _id: '61b20d07559afd470cfa9884',
    firstname: 'Toni',
    surname: 'Kross',
    password: 'tkross',
    email: 'tkross@gmail.com',
    group: '61b20709a915de06af722bea'
  },
  {
    _id: '61b20d07559afd470cfa9885',
    firstname: 'Rodrygo',
    surname: 'Goes',
    password: 'rgoes',
    email: 'rgoes@gmail.com',
    group: '61b20709a915de06af722bea'
  },
  {
    _id: '61b20d07559afd470cfa9886',
    firstname: 'Karim',
    surname: 'Benzema',
    password: 'kbenzema',
    email: 'kbenzema@gmail.com',
    group: '61b20709a915de06af722bea'
  },
  {
    _id: '61b20d07559afd470cfa9887',
    firstname: 'Koke',
    surname: 'Resurrección',
    password: 'kresurreccion',
    email: 'kresurreccion@gmail.com',
    group: '61b20709a915de06af722beb'
  },
  {
    _id: '61b20d07559afd470cfa9888',
    firstname: 'Jan',
    surname: 'Oblak',
    password: 'joblack',
    email: 'joblack@gmail.com',
    group: '61b20709a915de06af722beb'
  },
  {
    _id: '61b20d07559afd470cfa9889',
    firstname: 'Mario',
    surname: 'Hermoso',
    password: 'mhermoso',
    email: 'mhermoso@gmail.com',
    group: '61b20709a915de06af722beb'
  },
  {
    _id: '61b20d07559afd470cfa988a',
    firstname: 'Oscar',
    surname: 'Trejo',
    password: 'otrejo',
    email: 'otrejo@gmail.com',
    group: '61b20709a915de06af722bec'
  }
]

export const preloadDatabase = () => {
  UserModel.deleteMany({}, () => {
    log.info('User removed')
  })
  GroupModel.deleteMany({}, () => {
    log.info('Group removed')
  })

  GroupModel.insertMany(seedGroups)
  UserModel.insertMany(seedUsers)
}

export default preloadDatabase
