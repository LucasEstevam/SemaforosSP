<?php

namespace transito\ContentBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use transito\ContentBundle\Entity\Ocorrencia;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

class DefaultController extends Controller
{
    /*
    public function indexAction()
    {
        return $this->render('transitoContentBundle:Default:index.html.twig', array('name' => 'transito'));
    }
	*/
	
	
    public function __construct() {
	   date_default_timezone_set('America/Sao_Paulo');
    }
	
	public function getOcorrenciaAction() {
			
		$em = $this->getDoctrine()->getManager();
			
		//captura o POST
		$request = $this->get('request');
		$idSemaforo = $request->request->get('id');

		if ($idSemaforo === null) { 
			die();
		}
		
		//captura objeto Semaforo
		$semaforoObj = $em
				->getRepository('transitoContentBundle:Local')
				->find($idSemaforo);
		
		//cria objeto
		$ocorrencia = new Ocorrencia;
		$ocorrencia->setLocal($semaforoObj);
		$ocorrencia->setCreatedAt(new \DateTime());
		
		//grava na base
		$em = $this->getDoctrine()->getManager();
		$em->persist($ocorrencia);
		$em->flush();
		$em->clear();
		
		//die();
		//returno
		$response = new \Symfony\Component\HttpFoundation\Response(null);
		$response->headers->set('Access-Control-Allow-Origin', '*');
		return $response;
		
	}
	
	private function temOcorrencia($idSemaforo) {
			
		$em = $this->getDoctrine()->getManager();
		
		return $em
			->createQuery("
				SELECT p.created_at 
				FROM transitoContentBundle:Ocorrencia p
				JOIN p.local t
				WHERE t.id = " . $idSemaforo)
			->getResult();
					
	}
	
	public function semaforosAction() {
        
		$em = $this->getDoctrine()->getManager();
		
		//captura o POST
		$request = $this->get('request');
		$idSemaforo = $request->request->get('id');

		//busca todos semaforos
		if ($idSemaforo === null or $idSemaforo === '') { 
		
			/*$semaforos = $em
				->createQuery("
					SELECT x.*, COALESCE(y.CountOcorrencias,0)
					FROM transitoContentBundle:Local x 
					LEFT OUTER JOIN 
						(SELECT y.local, COUNT(id) as CountOcorrencias 
						FROM transitoContentBundle:Ocorrencia GROUP BY local) y 
					ON y.local = x.id")
				->getResult();*/
		
			$semaforos = $em
				->createQuery("
					SELECT p.id, p.local, p.latitude, p.longitude, 
						   t.id as ocorrencia, q.id as falha
					FROM transitoContentBundle:Local p
					LEFT JOIN transitoContentBundle:Ocorrencia t
						WHERE (p.id = t.local)
					LEFT JOIN transitoContentBundle:talaoFalha q
						WHERE (p.id = q.local) AND (q.data_encerramento is null)
					GROUP BY p")
				->getResult();
		
			//return $this->render('transitoContentBundle:Default:index.html.twig', array('semaforos' => $semaforos));
			//die();
		
			/*$semaforos = $em
				->getRepository('transitoContentBundle:Local')
				->findAll();*/ 
			
			/*$semaforos2 = array();
			foreach ($semaforos as $key => $semaforo) {
				$semaforos2[$key]['id'] = $semaforo->getId();
				$semaforos2[$key]['local'] = $semaforo->getLocal();
				$semaforos2[$key]['latitude'] = $semaforo->getLatitude();
				$semaforos2[$key]['longitude'] = $semaforo->getLongitude();
							
			}*/
			
			//retorna JSON
			$response = new JsonResponse();
			$response->setData($semaforos);
			$response->headers->set('Access-Control-Allow-Origin', '*');
			return $response;
		
		}
		//retorna as infos do semáforo específico
		else {

			//captura semaforo
			$semaforoObj = $em->getRepository('transitoContentBundle:Local')
				->createQueryBuilder('p')
				->select('p')
				->where('p.id = :id')
				->setParameter('id', $idSemaforo)
				->getQuery()
				->getSingleResult();
			
			//captura OCORRENCIAS
			$ocorrencias = $this->temOcorrencia($idSemaforo);
			
			//enxuga dateTime
			foreach ($ocorrencias as $key => $ocorrencia) {
				$ocorrencias[$key]['created_at'] = $ocorrencias[$key]['created_at']->format('Y-m-d H:i:s');; 
			}
			
			//captura FALHAS
			$falhas = $em
				->createQuery("
					SELECT p 
					FROM transitoContentBundle:talaoFalha p
					JOIN p.local t
					WHERE t.id = " . $idSemaforo)
				->getResult();
			
			//trata falhas
			$falhasTratado = array();
			foreach ($falhas as $key => $falha) {
				$falhasTratado[$key]['data_abertura'] = $falhas[$key]->getDataAbertura()->format('Y-m-d H:i:s');
				if ($falhas[$key]->getDataEncerramento() !== null) 
					$falhasTratado[$key]['data_encerramento'] = $falhas[$key]->getDataEncerramento()->format('Y-m-d H:i:s');
				else
					$falhasTratado[$key]['data_encerramento'] = null;
				$falhasTratado[$key]['nome'] = $falhas[$key]->getFalha()->getNome();
			}
			
			//return $this->render('transitoContentBundle:Default:index.html.twig', array('semaforos' => $falhasTratado));
			//die();
			
			//captura distrito e subprefeitura
			$distritoObj = $semaforoObj->getDistrito();
			$subprefeituraObj = $distritoObj->getSubprefeitura();
			
			//grava array
			$semaforo['id'] = $idSemaforo;
			$semaforo['local'] = $semaforoObj->getLocal();
			$semaforo['latitude'] = $semaforoObj->getLatitude();
			$semaforo['longitude'] = $semaforoObj->getLongitude();
			$semaforo['distrito'] = $distritoObj->getNome();
			$semaforo['subprefeitura'] = $subprefeituraObj->getNome();
			$semaforo['ocorrencias'] = $ocorrencias;
			$semaforo['falhas'] = $falhasTratado;
			
			//retorna JSON
			$response = new JsonResponse();
			$response->setData($semaforo);
			$response->headers->set('Access-Control-Allow-Origin', '*');
			return $response;
			
		}
		
    }
	
	
	
	public function distritosAction() {
        
		$em = $this->getDoctrine()->getManager();
		
		//busca todos
		$data = $em
			->getRepository('transitoContentBundle:Distrito')
			->findAll();
		
		//transforma entity em JSON com o serializer
		$serializer = new Serializer(array(new GetSetMethodNormalizer()), array('json' => new JsonEncoder()));
		$json = $serializer->serialize($data, 'json');
        	
        //returning JSON
        $response = new \Symfony\Component\HttpFoundation\Response($json);
		$response->headers->set('Access-Control-Allow-Origin', '*');
		return $response;
		
    }
	
	public function subprefeiturasAction() {
        
		$em = $this->getDoctrine()->getManager();
		
		//busca todos
		$data = $em
			->getRepository('transitoContentBundle:subprefeitura')
			->findAll();
		
		//transforma entity em JSON com o serializer
		$serializer = new Serializer(array(new GetSetMethodNormalizer()), array('json' => new JsonEncoder()));
		$json = $serializer->serialize($data, 'json');
        	
        //returning JSON
        $response = new \Symfony\Component\HttpFoundation\Response($json);
		$response->headers->set('Access-Control-Allow-Origin', '*');
		return $response;
		
    }
	
	public function ocorrenciasAction() {

		//busca ocorrencias
		$em = $this->getDoctrine()->getManager();		
		
		/*$query = $em->getRepository('transitoContentBundle:Ocorrencia')
				->createQueryBuilder('p')
				->select('p.idSemaforo, p.created_at')
				->getQuery();
				
		$ocorrencias = $query->getResult();*/
		
		$semaforos = $em
			->createQuery("
				SELECT p.id, p.local, p.latitude, p.longitude, 
					count(t.id) as nroOcorrencias
				FROM transitoContentBundle:Local p
				JOIN transitoContentBundle:Ocorrencia t
					WHERE (p.id = t.local)
				GROUP BY p
				ORDER BY nroOcorrencias DESC")
			->getResult();
		
		//enxuga dateTime
		/*foreach ($ocorrencias as $key => $ocorrencia) {
			$ocorrencias[$key]['created_at'] = $ocorrencias[$key]['created_at']->format('Y-m-d H:i:s');; 
		}*/
		
		//return $this->render('transitoContentBundle:Default:index.html.twig', array('semaforos' => $semaforos));
		//die();
		
		//retorna JSON
		/*$response = new JsonResponse();
		$response->setData($ocorrencias);
		return $response;*/
		
		//retorna JSON
		$response = new JsonResponse();
		$response->setData($semaforos);
		$response->headers->set('Access-Control-Allow-Origin', '*');
		return $response;
		
    }

	public function falhasAction() {

		//busca FALHAS
		$em = $this->getDoctrine()->getManager();		
		
		$semaforos = $em
			->createQuery("
				SELECT p.id, p.local, p.latitude, p.longitude, 
					count(t.id) as nroFalhas
				FROM transitoContentBundle:Local p
				JOIN transitoContentBundle:talaoFalha t
					WHERE (p.id = t.local)
				GROUP BY p
				ORDER BY nroFalhas DESC")
			->getResult();
		
		//retorna JSON
		$response = new JsonResponse();
		$response->setData($semaforos);
		$response->headers->set('Access-Control-Allow-Origin', '*');
		return $response;
		
    }
	
	public function todasFalhasEmAbertoAction() {

		//busca FALHAS em aberto
		$em = $this->getDoctrine()->getManager();		
		
		$falhas = $em
			->createQuery("
				SELECT p.id, p.local, p.latitude, p.longitude, 
					t.data_abertura, t.data_encerramento, q.nome
				FROM transitoContentBundle:Local p
				JOIN transitoContentBundle:talaoFalha t
					WHERE (p.id = t.local) and (t.data_encerramento is null)
				JOIN transitoContentBundle:Falha q
					WHERE (t.falha = q.id)
				")
			->getResult();

		foreach ($falhas as $key => $falha) {
			$falhas[$key]['data_abertura'] = $falhas[$key]['data_abertura']->format('Y-m-d H:i:s');
			if ($falhas[$key]['data_encerramento'] !== null) 
				$falhas[$key]['data_encerramento'] = $falhas[$key]['data_encerramento']->format('Y-m-d H:i:s');
			else
				$falhas[$key]['data_encerramento'] = null;
		}				
			
		//return $this->render('transitoContentBundle:Default:index.html.twig', array('semaforos' => $falhas));
		//die();
		
		//retorna JSON
		$response = new JsonResponse();
		$response->setData($falhas);
		$response->headers->set('Access-Control-Allow-Origin', '*');
		return $response;
		
    }
}
