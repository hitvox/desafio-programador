<?php

namespace App\Http\Controllers;

use App\Models\Config;
use Illuminate\Http\JsonResponse;

use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function new_product(Request $request): JsonResponse
    {
        $config = Config::first();
        $access_token = $config->access_token;

        $data['title'] = $request->post('title');
        $data['category_id'] = $request->post('category_id');
        $data['price'] = $request->post('price');
        $data['currency_id'] = "BRL";
        $data['available_quantity'] = $request->post('available_quantity');
        $data['buying_mode'] = "buy_it_now";
        $data['condition'] = "new";
        $data['listing_type_id'] = "bronze";
        
        $curl = curl_init();

        curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://api.mercadolibre.com/items',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json',
            'Authorization: Bearer '.$access_token,
        ),
        ));
        
        $response = curl_exec($curl);
        
        curl_close($curl);
        
        $result = json_decode($response, true);
        
        if ($result['status'] === 200) {
            $data_result = array(
                'id' => $result['body']['id'],
            );
            return response()->json([
                'status' => true,
                'data' => $data_result
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => $result['message']
            ]);
        }
    }


    public function categories(): JsonResponse
    {
        // allow memory
        ini_set('memory_limit', '-1');

        $url = "https://api.mercadolibre.com/sites/MLB/categories/all";
        
        $curl_options = array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json"
            ),
        );
        
        $curl = curl_init();
        
        curl_setopt_array($curl, $curl_options);
        
        $response = curl_exec($curl);
        
        $result = json_decode($response);
        
        curl_close($curl);

        $categories = array();

        $i = 0;
        foreach ($result as $category) {
            $categories[] = [
                'id' => $category->id,
                'name' => $category->name
            ];

            // only 25 categories
            if ($i >= 25) break;
            
            $i++;
        }

        return response()->json([
            'status' => true,
            'data' => $categories
        ]);
    }
}