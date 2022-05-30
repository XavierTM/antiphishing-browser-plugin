
const { Model, DataTypes, Sequelize, define: defineModel } = require('sequelize');

class Domain extends Model {

	static init(sequelize) {

		super.init({
			domain: {
				type: DataTypes.STRING,
				allowNull: false,
                unique: true,
			},
            count: {
                type: DataTypes.INTEGER,
                defaultValue: 1
            }
		}, { sequelize });

	}
}



const dialect = `sqlite::${__dirname}/db.sqlite`;
const sequelize = new Sequelize(dialect, { logging: false, dialect: 'sqlite' });


async function init() {


	Domain.init(sequelize);
	
	let force = false;

	if (process.env.NODE_ENV === 'production')
		force = false;

	await sequelize.sync({ force });

}



module.exports = {
	Domain,
	init,
	sequelize
}