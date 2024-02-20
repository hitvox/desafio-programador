<?php

namespace App\Http\Controllers;

use App\Models\Config;
use Illuminate\Http\JsonResponse;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ConfigController extends Controller
{
    public function index(): JsonResponse
    {
        $config = Config::first();

        $data = [
            'client_id' => $config ? $config->client_id : '',
            'client_secret' => $config ? $config->client_secret : '',
            'redirect_uri' => $config ? $config->redirect_uri : '',
        ];

        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $rules = [
            'client_id' => 'required|string',
            'client_secret' => 'required|string',
            'redirect_uri' => 'required|string',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors()->first(),
            ]);
        }
        
        $validated = $request->validate($rules);
        
        $config = Config::first();
    
        if (!$config) {
            $config = new Config();
        }
    
        $config->fill($validated);
        $config->save();
    
        return response()->json([
            'status' => true,
            'message' => 'Config updated successfully',
        ]);
    }


    public function permission_ml(Request $request): JsonResponse
    {
        $config = Config::first();
        $client_id = $config->client_id;
        $client_secret = $config->client_secret;
        $redirect_uri = $config->redirect_uri;

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'https://api.mercadolibre.com/oauth/token',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => '{
                "grant_type":"authorization_code",
                "client_id": '.$client_id.',
                "client_secret": '.$client_secret.',
                "code": '.$request->get('code').',
                "redirect_uri":"'.$redirect_uri.'",
                "accept":"application/json",
                "content-type": "application/x-www-form-urlencoded"
            }',
        ));
        
        $response = curl_exec($curl);
        $result = json_decode($response);
        curl_close($curl);

        if(isset($result->error)) {
            return response()->json([
                'status' => false,
                'message' => $result->error_description,
            ]);
        }
        
        $config->code = $result->refresh_token;
        $config->access_token = $result->access_token;
        $config->save();

        return response()->json([
            'status' => true,
            'message' => '',
        ]);
    }

    public function me(): JsonResponse
    {
        $url = "https://api.mercadolibre.com/users/me";

        $config = Config::first();
        $access_token = $config->access_token;
        
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
                "Authorization: Bearer " . $access_token,
                "Content-Type: application/json"
            ),
        );

        $curl = curl_init();
        
        curl_setopt_array($curl, $curl_options);
        
        $response = curl_exec($curl);
        $result = json_decode($response);
        
        curl_close($curl);

        if(isset($result->message)) {
            $getRefresh = $this->refreshToken();
            if(!$getRefresh) {
                return response()->json([
                    'status' => false,
                    'message' => $result->message,
                ]);
            }
        }

        $data = array(
            'first_name' => $result->first_name
        );

        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    private function refreshToken(): bool
    {
        $config = Config::first();
        $client_id = $config->client_id;
        $client_secret = $config->client_secret;
        $refresh_token = $config->code;
        $url = "https://api.mercadolibre.com/oauth/token";
        
        $fields = array(
            "grant_type" => "refresh_token",
            "client_id" => $client_id,
            "client_secret" => $client_secret,
            "refresh_token" => $refresh_token
        );
        
        $curl_options = array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => http_build_query($fields),
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/x-www-form-urlencoded",
                "Accept: application/json"
            ),
        );
        
        $curl = curl_init();
        
        curl_setopt_array($curl, $curl_options);
        
        $response = curl_exec($curl);
        $result = json_decode($response);
        
        curl_close($curl);
        
        if(isset($result->access_token) && isset($result->refresh_token)) {
            $config->access_token = $result->access_token;
            $config->code = $result->refresh_token;
            $config->save();

            return true;
        }

        return false;
    }
}
