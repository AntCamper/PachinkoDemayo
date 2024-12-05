import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import ScoreDisplay from "./ScoreDisplay"; // Import the ScoreDisplay component
import "./GameBoard.css";

function GameBoard() {
    const gameBoardRef = useRef();
    const [engine, setEngine] = useState(null);
    const [score, setScore] = useState(0); // State to track the score
    const [gameRunning, setGameRunning] = useState(false); // Track if the game is running

    useEffect(() => {
        // Create a Matter.js engine
        const newEngine = Matter.Engine.create();
        newEngine.world.gravity.y = 1; // Apply gravity
        setEngine(newEngine);

        const render = Matter.Render.create({
            element: gameBoardRef.current,
            engine: newEngine,
            options: {
                width: 400,
                height: 600,
                wireframes: true, // Debug: show all objects
                background: "#f4f4f4",
            },
        });

        // Create boundaries (outer edges only)
        const ground = Matter.Bodies.rectangle(200, 590, 400, 20, { isStatic: true });
        const leftWall = Matter.Bodies.rectangle(0, 300, 20, 600, { isStatic: true });
        const rightWall = Matter.Bodies.rectangle(400, 300, 20, 600, { isStatic: true });

        // Create pins
        const pins = [];
        for (let y = 100; y < 500; y += 100) {
            for (let x = 50; x < 400; x += 50) {
                const pin = Matter.Bodies.circle(x, y, 5, { isStatic: true, scoreValue: true });
                pins.push(pin);
            }
        }

        // Add boundaries and pins to the world
        Matter.World.add(newEngine.world, [ground, leftWall, rightWall, ...pins]);

        // Use Runner instead of Engine.run
        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, newEngine);
        Matter.Render.run(render);

        return () => {
            // Cleanup Matter.js engine and renderer
            Matter.Render.stop(render);
            Matter.Engine.clear(newEngine);
            render.canvas.remove();
            render.textures = {};
        };
    }, []);

    const dropBall = () => {
        if (engine) {
            setGameRunning(true); // Start the game
            // Create the ball above the pins
            const newBall = Matter.Bodies.circle(200, 50, 10, {
                restitution: 0.8, // Bounciness
                friction: 0.001, // Reduce sticking
                render: {
                    fillStyle: "blue", // Debug: Color the ball for visibility
                },
            });

            // Add the ball to the physics world
            Matter.World.add(engine.world, newBall);

            // Check when the ball hits the ground and update score
            Matter.Events.on(engine, "collisionEnd", (event) => {
                event.pairs.forEach(pair => {
                    // Check for collision with pins
                    if (pair.bodyA.scoreValue && pair.bodyA !== newBall) {
                        // Apply a glowing effect to the pin when it's hit
                        applyGlowEffect(pair.bodyA);

                        // Optional: Update score when pin is hit
                        setScore(prevScore => prevScore + 10); // Increment score by 10 on each pin hit
                    }

                    if (pair.bodyB.scoreValue && pair.bodyB !== newBall) {
                        // Apply a glowing effect to the pin when it's hit
                        applyGlowEffect(pair.bodyB);

                        // Optional: Update score when pin is hit
                        setScore(prevScore => prevScore + 10); // Increment score by 10 on each pin hit
                    }
                });
            });
        }
    };

    const applyGlowEffect = (pin) => {
        // Set the glow effect on the pin when it is hit
        Matter.Body.set(pin, {
            render: {
                fillStyle: "yellow", // Change pin color to yellow for glowing effect
                shadow: {
                    blur: 10,           // Glow intensity
                    color: "yellow",    // Glow color
                    offsetX: 0,         // No horizontal offset
                    offsetY: 0,         // No vertical offset
                },
            },
        });

        // Reset the glow effect after 1 second
        setTimeout(() => {
            Matter.Body.set(pin, {
                render: {
                    fillStyle: "red",   // Reset to original color
                    shadow: null,       // Remove the shadow (glow effect)
                },
            });
        }, 1000); // Glow duration (in milliseconds)
    };

    const resetGame = () => {
        setScore(0); // Reset the score
        setGameRunning(false); // Stop the game
        Matter.Engine.clear(engine); // Clear the engine and reset world
        dropBall(); // Optionally drop a new ball after reset
    };

    return (
        <div>
            <div ref={gameBoardRef} className="game-board"></div>
            <ScoreDisplay score={score} /> {/* Display the score */}
            <button onClick={dropBall} disabled={gameRunning} className="start-button">
                Start Game
            </button>
            <button onClick={resetGame} className="reset-button">Reset Game</button>
        </div>
    );
}

export default GameBoard;
