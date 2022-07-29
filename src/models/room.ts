'use strict';
import { Model } from "sequelize"
module.exports = (sequelize: any, DataTypes: any) => {
  class room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      room.belongsTo(models.user, {foreignKey: "owner"})
    }
  }
  room.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duration: {
      type: DataTypes.FLOAT(4, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'room',
  });
  return room;
};