using {db} from '../db/data-model';

service UserService @(path : '/user') {
    entity Users as projection on db.Users;
    action lockAccount(id : Users:ID);
    action unlockAccount(id : Users:ID);
}

annotate UserService.Users with @(restrict : [{
    grant : ['READ'],
    to    : 'Admin',
    where : 'department = $user.department'
}]);
