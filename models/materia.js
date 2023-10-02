'use strict';
module.exports = (sequelize, DataTypes) => {
  const materia = sequelize.define('materia', {
    nombre: DataTypes.STRING,
    carrera_id: DataTypes.INTEGER,
    profesor_id: DataTypes.INTEGER,
    aula_id: DataTypes.INTEGER

  }, {tableName:"materias"});

  
  materia.associate = function(models) {
    materia.belongsTo(models.Aula ,{as:'aulaAsignada' ,foreignKey: 'aula_id'})


  	//asociacion a carrera (pertenece a:)
  	materia.belongsTo(models.carrera// modelo al que pertenece
    ,{
      as : 'Carrera-Relacionada',  // nombre de mi relacion
      foreignKey: 'carrera_id'     // campo con el que voy a igualar
    }) /////////////////////


  };
  


  return materia;
};