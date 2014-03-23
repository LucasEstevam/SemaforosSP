<?php

namespace transito\ContentBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Distrito
 */
class Distrito
{
    /**
     * @var integer
     */
    private $id;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }
    /**
     * @var string
     */
    private $nome;


    /**
     * Set nome
     *
     * @param string $nome
     * @return Distrito
     */
    public function setNome($nome)
    {
        $this->nome = $nome;

        return $this;
    }

    /**
     * Get nome
     *
     * @return string 
     */
    public function getNome()
    {
        return $this->nome;
    }
    /**
     * @var \transito\ContentBundle\Entity\subprefeitura
     */
    private $subprefeitura;


    /**
     * Set subprefeitura
     *
     * @param \transito\ContentBundle\Entity\subprefeitura $subprefeitura
     * @return Distrito
     */
    public function setSubprefeitura(\transito\ContentBundle\Entity\subprefeitura $subprefeitura = null)
    {
        $this->subprefeitura = $subprefeitura;

        return $this;
    }

    /**
     * Get subprefeitura
     *
     * @return \transito\ContentBundle\Entity\subprefeitura 
     */
    public function getSubprefeitura()
    {
        return $this->subprefeitura;
    }
}
