const { Score } = require('../db.js');


const generateProblem = (difficulty) => {
  let a, b, answer;
  const randomRange = {
    easy: { min: 1, max: 10 },
    medium: { min: 10, max: 50 },
    hard: { min: 50, max: 100 }
  };

  a = Math.floor(Math.random() * (randomRange[difficulty].max - randomRange[difficulty].min + 1)) + randomRange[difficulty].min;
  b = Math.floor(Math.random() * (randomRange[difficulty].max - randomRange[difficulty].min + 1)) + randomRange[difficulty].min;
  answer = a + b;

  return {
    question: `¿Cuánto es ${a} + ${b}?`,
    answer,
    options: [answer, answer + 2, answer - 2, answer + 5].sort(() => Math.random() - 0.5),
    difficulty
  };
};
const getProblem = (req, res) => {
  const { difficulty = 'easy' } = req.query;
  res.json(generateProblem(difficulty));
};

const postScore = async (req, res) => {
    const { id, difficulty, isCorrect } = req.body;
  
    if (!isCorrect) {
      return res.json({
        success: false,
        message: "Respuesta incorrecta - no se suman puntos"
      });
    }
  
    try {
      let pointsToAdd = 0;
      switch (difficulty) {
        case 'easy':
          pointsToAdd = 1;
          break;
        case 'medium':
          pointsToAdd = 2;
          break;
        case 'hard':
          pointsToAdd = 3;
          break;
        default:
          return res.status(400).json({ 
            error: "Dificultad no válida. Use 'easy', 'medium' o 'hard'" 
          });
      }
  
      const [score, created] = await Score.findOrCreate({
        where: { id },
        defaults: { 
          score: 0,
          difficulty: difficulty // Asegúrate de incluir la dificultad aquí
        }
      });
  
      // Actualiza la dificultad por si cambió
      score.difficulty = difficulty;
      score.score += pointsToAdd;
      await score.save();
  
      return res.json({
        success: true,
        difficulty,
        pointsAdded: pointsToAdd,
        totalScore: score.score,
        message: `¡Puntos sumados! (+${pointsToAdd})`
      });
  
    } catch (error) {
      console.error("Error en postScore:", error);
      return res.status(500).json({ 
        error: "Error al actualizar el puntaje",
        details: error.message 
      });
    }
  };
  const getScore = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        
        if (!id) {
            const error = new Error('No se ha especificado el ID del score');
            error.status = 400;
            throw error;
        }      
        const score = await Score.findByPk(id);        
        if (!score) {
            const error = new Error('Score no encontrado');
            error.status = 404; 
            throw error;
        }   
        res.status(200).json({
        success: true,
        data: score
        });
    } catch (error) {
        // Pasar el error al middleware de manejo de errores
        next(error);
    }
};
  
module.exports = {
  getProblem,
  postScore,
  getScore
};