'use strict';
module.exports = (sequelize, DataTypes) => {
  const alumno = sequelize.define('Alumno', {
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    fecInscripcion: DataTypes.DATE,
    fecNacimiento: DataTypes.DATE,
    carrera_id: DataTypes.INTEGER
  }, {tableName:"Alumnos"});
  
  alumno.associate = function(models) {
    

  	//asociacion a carrera (pertenece a:)
  	alumno.belongsTo(models.carrera// modelo al que pertenece
    ,{foreignKey: 'carrera_id'     // campo con el que voy a igualar
    })

  };
    return alumno;
};