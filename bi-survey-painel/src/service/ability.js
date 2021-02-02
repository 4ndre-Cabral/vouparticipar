import { AbilityBuilder, Ability } from '@casl/ability'

const { can, rules } = new AbilityBuilder()
can('read', [])
can('create', [])
can('update', [])
can('delete', [])

export default new Ability(rules)
