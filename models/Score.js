const { DataTypes } = require('sequelize');
const sequelize = require('../db');

module.exports = (sequelize) => {
    sequelize.define(
      'Score',
      {
        id:{
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey:true
        },
        difficulty:{
          type: DataTypes.STRING,
          allowNull: false
        },      
        score:{
          type: DataTypes.INTEGER,
          allowNull: false
        }
      },{
        timestamps: false,
      }
      );
    };
           
        