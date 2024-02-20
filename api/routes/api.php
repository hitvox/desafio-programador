<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('config', 'App\Http\Controllers\ConfigController@index');
Route::post('config', 'App\Http\Controllers\ConfigController@store');
Route::get('permission_ml', 'App\Http\Controllers\ConfigController@permission_ml');
Route::get('me', 'App\Http\Controllers\ConfigController@me');
Route::get('products/categories', 'App\Http\Controllers\ProductController@categories');
Route::post('products', 'App\Http\Controllers\ProductController@new_product');