<?php

namespace transito\ContentBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * talaoFalha
 */
class talaoFalha
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
     * @var \DateTime
     */
    private $data_abertura;

    /**
     * @var \DateTime
     */
    private $data_encerramento;

    /**
     * @var \transito\ContentBundle\Entity\Local
     */
    private $local;

    /**
     * @var \transito\ContentBundle\Entity\Falha
     */
    private $falha;


    /**
     * Set data_abertura
     *
     * @param \DateTime $dataAbertura
     * @return talaoFalha
     */
    public function setDataAbertura($dataAbertura)
    {
        $this->data_abertura = $dataAbertura;

        return $this;
    }

    /**
     * Get data_abertura
     *
     * @return \DateTime 
     */
    public function getDataAbertura()
    {
        return $this->data_abertura;
    }

    /**
     * Set data_encerramento
     *
     * @param \DateTime $dataEncerramento
     * @return talaoFalha
     */
    public function setDataEncerramento($dataEncerramento)
    {
        $this->data_encerramento = $dataEncerramento;

        return $this;
    }

    /**
     * Get data_encerramento
     *
     * @return \DateTime 
     */
    public function getDataEncerramento()
    {
        return $this->data_encerramento;
    }

    /**
     * Set local
     *
     * @param \transito\ContentBundle\Entity\Local $local
     * @return talaoFalha
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

    /**
     * Set falha
     *
     * @param \transito\ContentBundle\Entity\Falha $falha
     * @return talaoFalha
     */
    public function setFalha(\transito\ContentBundle\Entity\Falha $falha = null)
    {
        $this->falha = $falha;

        return $this;
    }

    /**
     * Get falha
     *
     * @return \transito\ContentBundle\Entity\Falha 
     */
    public function getFalha()
    {
        return $this->falha;
    }
}
