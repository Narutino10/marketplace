db = db.getSiblingDB('marketplace');

db.createUser({
    user: 'some_user',
    pwd: 'random_pass',
    roles: [
        {
            role: 'dbOwner',
            db: 'marketplace',
        },
    ],
});

db.createCollection('users');
db.createCollection('products');

db.users.insertOne(
    {
        name: 'Bill Palmer'
    }
);

db.products.insertMany([
    { name: 'whey', category: 'supplement', price: 20.0, stock: 100 },
    { name: 'casein', category: 'supplement', price: 25.0, stock: 80 },
    { name: 'creatine', category: 'supplement', price: 15.0, stock: 50 },
    { name: 'multivitamin', category: 'vitamin', price: 10.0, stock: 200 },
    { name: 'fish oil', category: 'supplement', price: 12.0, stock: 150 },
    { name: 'BCAA', category: 'supplement', price: 18.0, stock: 120 },
    { name: 'pre-workout', category: 'supplement', price: 30.0, stock: 60 },
    { name: 'post-workout', category: 'supplement', price: 22.0, stock: 70 },
    { name: 'glutamine', category: 'supplement', price: 17.0, stock: 90 },
    { name: 'protein bar', category: 'snack', price: 3.0, stock: 300 }
]);
