import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "users" })
export class Users {
    @PrimaryColumn("uuid")
    user_id: string

    @Column()
    name: string

    @Column()
    age: number

    @Column()
    gender: string

    @Column()
    status: boolean
    
    @Column()
    creationtimestamp: string
    
    @Column({nullable: true })
    modificationtimestamp?: string
}