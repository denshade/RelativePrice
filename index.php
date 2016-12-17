<?php

use Psr\Http\Message\ResponseInterface;

require 'vendor/autoload.php';

// Create and configure Slim app
$config = ['settings' => [
            'displayErrorDetails' => true,
        'addContentLengthHeader' => false,
        ]];
$app = new \Slim\App($config);



// Define app routes
$app->get('/ping', function ($request, $response, $args) {
    return $response->write("pong");
});
// Define app routes
$app->get('/store', function ($request, ResponseInterface $response, $args) {
    /*$response->withHeader('Access-Control-Allow-Origin','*');
    header('Access-Control-Allow-Origin','*');
    return "{ 
                \"stores\" : 
                [
                    {\"store\" : 
                        {
                            \"name\" : \"Delhaize Deinze\",
                            \"lattitude\" : \"50.9809227\", 
                            \"longitude\" : \"3.5344354\"        
                        }
                    },
                    {\"store\" : 
                        {
                            \"name\" : \"Delhaize Zingem\",
                            \"lattitude\" : \"50.9029995\",
                            \"longitude\" : \"3.6538823\"        
                        }
                    },
                    {\"store\" : 
                        {
                            \"name\" : \"Macro\",
                            \"lattitude\" : \"50.978919\",
                            \"longitude\" : \"3.6609026\"        
                        }
                    },
                    {\"store\" : 
                        {
                            \"name\" : \"Colruyt Deinze\",
                            \"lattitude\" : \"50.9807994\",
                            \"longitude\" : \"3.5472237 \"        
                        }
                    },
                    {\"store\" : 
                        {
                            \"name\" : \"Spar\",
                            \"lattitude\" : \"50.9110302\",
                            \"longitude\" : \"3.6056243\"        
                        }
                    },
                    {\"store\" : 
                        {
                            \"name\" : \"Okay Zingem\",
                            \"lattitude\" : \"50.9073175\",
                            \"longitude\" : \"3.6389592\"        
                        }
                    }
                ]                
            }";*/

    $response = $response->withAddedHeader('Access-Control-Allow-Origin','*');
    $response = $response->withJson("{
                \"stores\" : 
                [
                    {\"store\" : 
                        {
                            \"name\" : \"Delhaize Deinze\",
                            \"lattitude\" : \"50.9809227\", 
                            \"longitude\" : \"3.5344354\"        
                        }
                    },
                    {\"store\" : 
                        {
                            \"name\" : \"Delhaize Zingem\",
                            \"lattitude\" : \"50.9029995\",
                            \"longitude\" : \"3.6538823\"        
                        }
                    },
                    {\"store\" : 
                        {
                            \"name\" : \"Macro\",
                            \"lattitude\" : \"50.978919\",
                            \"longitude\" : \"3.6609026\"        
                        }
                    },
                    {\"store\" : 
                        {
                            \"name\" : \"Colruyt Deinze\",
                            \"lattitude\" : \"50.9807994\",
                            \"longitude\" : \"3.5472237 \"        
                        }
                    },
                    {\"store\" : 
                        {
                            \"name\" : \"Spar\",
                            \"lattitude\" : \"50.9110302\",
                            \"longitude\" : \"3.6056243\"        
                        }
                    },
                    {\"store\" : 
                        {
                            \"name\" : \"Okay Zingem\",
                            \"lattitude\" : \"50.9073175\",
                            \"longitude\" : \"3.6389592\"        
                        }
                    }
                ]                
            }");
    return $response;
});





/**
 * 
 * imagefilter($im, IMG_FILTER_GRAYSCALE);
imagefilter($im, IMG_FILTER_CONTRAST, 255);
imagefilter($im, IMG_FILTER_NEGATE);
imagefilter($im, IMG_FILTER_COLORIZE, 2, 118, 219);
imagefilter($im, IMG_FILTER_NEGATE);
 */
// Nearest-neighbor interpolation
// face blur
// face detection
// QR code reader.
// Conversie van images => vector.
// OCR tracing
//
// Run app
$app->run();
