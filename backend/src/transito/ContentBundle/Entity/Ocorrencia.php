<?php

namespace transito\ContentBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Ocorrencia
 */
class Ocorrencia
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
     * @var integer
     */
    private $idSemaforo;

    /**
     * @var \DateTime
     */
    private $created_at;


    /**
     * Set idSemaforo
     *
     * @param integer $idSemaforo
     * @return Ocorrencia
     */
    public function setIdSemaforo($idSemaforo)
    {
        $this->idSemaforo = $idSemaforo;

        return $this;
    }

    /**
     * Get idSemaforo
     *
     * @return integer 
     */
    public function getIdSemaforo()
    {
        return $this->idSemaforo;
    }

    /**
     * Set created_at
     *
     * @param \DateTime $createdAt
     * @return Ocorrencia
     */
    public function setCreatedAt($createdAt)
    {
        $this->created_at = $createdAt;

        return $this;
    }

    /**
     * Get created_at
     *
     * @return \DateTime 
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }
    /**
     * @var \transito\ContentBundle\Entity\Local
     */
    private $local;


    /**
     * Set local
     *
     * @param \transito\ContentBundle\Entity\Local $local
     * @return Ocorrencia
     */
    public function setLocal(\transito\ContentBundle\Entity\Local $local = null)
    {
        $this->local = $local;

        return $this;
    }

    /**
     * Get local
     *
     * @return \transito\ContentBundle\Entity\Local 
     */
    public function getLocal()
    {
        return $this->local;
    }
}
