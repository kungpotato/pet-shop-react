import faker from '@faker-js/faker'
import react, { useState } from 'react'
import { useMoralis, useMoralisFile } from 'react-moralis'
import { Button, Container, Form, Icon, Input, Label, Reveal, TextArea } from 'semantic-ui-react'
import { NFTInstance, PotatoMarketInstance } from '../../types/truffle-contracts'
import { config } from '../config'
import { useContractJson } from '../hooks/contracts'
import { getEtherContract } from '../libs/ethereum'
import Moralis from 'moralis'
import { ethers } from 'ethers'
import { loadNFTs } from '../services'
import { useAppDispatch } from '../states/hooks'
import { setNFTs } from '../states/expore/reducer'

interface IformInput {
    price: string
    name: string
    description: string
}

export const Create = (): JSX.Element => {
    const { saveFile } = useMoralisFile()
    const { isAuthenticated } = useMoralis()
    const dispatch = useAppDispatch()
    const { NFTContract, potatoMarketContract } = useContractJson()

    const formInput: IformInput = {
        name: faker.company.companyName(),
        description: faker.commerce.productDescription(),
        price: '2'
    }

    const [fileTarget, setFileTarget] = useState()

    const fileInput = (e: any) => {
        setFileTarget(e.target.files[0])
    }

    const createMarket = async () => {
        if (fileTarget) {
            saveFile((fileTarget as any).name, fileTarget, {
                type: 'base64',
                saveIPFS: true,
                onSuccess: async (result) => {
                    const url = (result as any).ipfs()

                    if (result) {
                        createSale(url)
                    }
                },
                onError: (error) => console.log(error)
            })
        }
    }

    const createSale = async (url: string) => {
        try {
            const { name, description } = formInput

            if (potatoMarketContract && NFTContract) {
                const marketContract = (await getEtherContract(
                    potatoMarketContract,
                    config.marketContractAddress
                )) as unknown as PotatoMarketInstance
                const ntfContract = (await getEtherContract(NFTContract, config.nftContractAddress)) as unknown as NFTInstance

                const mintToken = await ntfContract.mintToken(url)
                const tx = await (mintToken as any).wait()

                const event = tx.events[0]
                console.log(tx)

                const value = event.args[2]
                const itemId = value.toNumber()

                const data = JSON.stringify({
                    url: url,
                    name,
                    description,
                    itemId,
                    price: formInput.price,
                    seller: tx.to,
                    owner: tx.from
                })

                const obj = new Moralis.Object(config.dbName)
                obj.set('itemId', itemId)
                obj.set('data', data)
                await obj.save()

                /* then list the item for sale on the marketplace */
                const price = ethers.utils.parseUnits(formInput.price, 'ether')

                const listingPrice = await marketContract?.getListingPrice()

                const makeMarketItem = await marketContract?.makeMarketItem(
                    config.nftContractAddress,
                    itemId,
                    price.toString(),
                    {
                        value: listingPrice.toString()
                    }
                )

                await (makeMarketItem as any).wait()

                loadNFTs(potatoMarketContract, NFTContract, isAuthenticated).then((data) => {
                    dispatch(setNFTs(data))
                })

                setFileTarget(undefined)
            }
        } catch (error) {
            console.log('Error: ', error)
        }
    }

    const handleClick = () => {
        const inputElement = document.getElementById('uploadAvatar')
        if (inputElement) {
            inputElement.click()
        }
    }
    console.log('fileTarget', fileTarget)

    const CustomForm = Form as any
    const CustomReveal = Reveal as any
    return (
        <Container fluid={false} style={{ padding: '20px' }}>
            <div>
                <input id='uploadAvatar' style={{ display: 'none' }} type="file" onChange={fileInput} />
                {/* <div onClick={handleClick} style={{ width: '350px', cursor: 'pointer', height: '200px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px  dashed #fff', padding: '4px' }}>
                    {fileTarget && <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={URL.createObjectURL((fileTarget as any))} alt="" />}
                    {!fileTarget && <Icon name='camera' size='big' />}
                </div> */}
                <CustomReveal onClick={handleClick} animated='fade' style={{ width: '350px', cursor: 'pointer', height: '200px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px  dashed #fff', padding: '4px' }}>
                    <Reveal.Content visible style={{ width: '100%', height: '100%' }}>
                        {fileTarget && <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={URL.createObjectURL((fileTarget as any))} alt="" />}
                    </Reveal.Content>
                    <Reveal.Content hidden>
                        <Icon name='camera' size='big' />
                    </Reveal.Content>
                </CustomReveal>
                <CustomForm size='small' inverted style={{ marginTop: '14px' }}>
                    <Form.Group>
                        <Form.Input required label='Name' placeholder='Item name' width={6} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Input
                            required
                            id='form-textarea-control-opinion'
                            width={6}
                            control={TextArea}
                            label='Description'
                            placeholder='Description'
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Input labelPosition='left' action={{ icon: 'ethereum' }} required label='Price' placeholder='Amount' width={6} />
                    </Form.Group>
                </CustomForm>
                <Button color='blue' variant="outlined" style={{ marginTop: '14px' }} onClick={createMarket}>
                    Create
                </Button>
            </div>
        </Container>
    )
}
