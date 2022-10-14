using {db} from '../db/data-model';

service UserService @(path : '/user') {
    @readonly
    entity Users as projection on db.Users;

    action lockAccount(id : Users:ID);
    action unlockAccount(id : Users:ID);
}

service APIService @(
    requires : 'authenticated-user',
    path     : '/api'
) {
    function userInfo() returns String;
}

annotate UserService.Users with @(restrict : [{
    grant : '*',
    to    : 'Admin',
    where : '$user.Department = department'
}]);
