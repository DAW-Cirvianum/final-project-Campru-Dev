<?php

namespace App\Swagger;

/**
 * @OA\Info(
 *     title="Assetto Corsa Performance Tracker API",
 *     version="1.0.0",
 *     description="Documentación API del proyecto final"
 * )
 *
 * @OA\Get(
 *     path="/api/test",
 *     tags={"Test"},
 *     summary="Ruta dummy para inicializar Swagger",
 *     @OA\Response(
 *         response=200,
 *         description="OK"
 *     )
 * )
 */
class Swagger {}
