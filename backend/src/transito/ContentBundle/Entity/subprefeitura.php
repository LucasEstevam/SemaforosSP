<?php

namespace transito\ContentBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * subprefeitura
 */
class subprefeitura
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
     * @return subprefeitura
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
}
