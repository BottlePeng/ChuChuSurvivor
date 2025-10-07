import { Vec2 } from "cc";
import { Agent } from "./Agent";
import { Obstacle, RVOMath, Vector2 } from "./Common";
import { KdTree } from "./kdtree";


export class Simulator {
    private agentId: number = 0;
    private agentIdLst: number[] = [];
    aid2agent: { [key: string]: Agent } = Object.create(null);

    obstacles: Obstacle[] = [];
    kdTree: KdTree = new KdTree(Simulator);


    defaultAgent: Agent; // Agent
    time: number = 0.0;

    private static _inst: Simulator;
    static get instance(): Simulator {
        if (!Simulator._inst) {
            Simulator._inst = new Simulator();
        }
        return Simulator._inst;
    }

    getAgent(idx: number) {
        return this.aid2agent[this.agentIdLst[idx]];
    }

    getAgentByAid(aid: number) {
        return this.aid2agent[aid];
    }

    getGlobalTime() {
        return this.time;
    };

    getNumAgents() {
        // console.log("getNumAgents ::", this.agentIdLst.length, this.agentIdLst)
        return this.agentIdLst.length;
    };

    getAgentAidByIdx(idx: number) {
        return this.agentIdLst[idx]
    }


    setAgentPrefVelocity(aid: number, velocity: Vector2 | Vec2) {
        if (!this.aid2agent[aid]) return
        this.aid2agent[aid].prefVelocity_.copy(velocity);
    }

    getAgentPosition(aid: number) {
        if (this.aid2agent[aid]) {//为什么移除了 还会进入这个aid的检测
            return this.aid2agent[aid].position_;
        }
        return null

    }

    getAgentPrefVelocity(aid: number) {
        return this.aid2agent[aid].prefVelocity_;
    }

    getAgentVelocity(aid: number) {
        return this.aid2agent[aid].velocity_;
    }

    getAgentRadius(aid: number) {
        return this.aid2agent[aid].radius_;
    }

    getAgentOrcaLines(aid: number) {
        return this.aid2agent[aid].orcaLines_;
    }

    /**
     * 添加动态避障管理对象
     * @param vector2 初始位置
     * @param maxSpeed  最大速度
     * @param radius  检测半径
     * @param neighborDist  在寻找周围邻居的搜索距离，这个值设置过大，会让小球在很远距离时做出避障行为
     * @param maxNeighbors 寻找周围邻居的最大数目，这个值设置越大，最终计算的速度越精确，但会增大计算量
     * @param timeHorizon 代表计算动态的物体时的时间窗口
     * @param timeHorizonObst 代表计算静态的物体时的时间窗口，比如在RTS游戏中，小兵向城墙移动时，没必要做出避障，这个值需要 设置得很小
     * @param mass 转向质量
     * @returns
     */
    addAgent(param) {
        param = {...{
            vector2: Vector2,
            maxSpeed: 100,
            radius: 20,
            neighborDist: null,
            maxNeighbors: 3,
            timeHorizon: 1,
            timeHorizonObst: 0.1,
            mass: 1,
        }, ...param}

        let agent = new Agent()
        agent.position_.copy(param.vector2)
        agent.maxNeighbors_ = param.maxNeighbors
        agent.maxSpeed_ = param.maxSpeed
        agent.neighborDist = param.neighborDist || param.radius * 2
        agent.radius_ = param.radius
        agent.timeHorizon = param.timeHorizon
        agent.timeHorizonObst = param.timeHorizonObst
        agent.velocity_ = new Vector2(0, 0)
        agent.id = this.agentId++
        agent.mass = param.mass
        this.aid2agent[agent.id] = agent
        this.agentIdLst.push(agent.id)
        return agent.id
    }

    removeAgent(aid: number) {
        if (this.hasAgent(aid)) {
            let idx = this.agentIdLst.indexOf(aid);
            if (idx >= 0) {
                // this.agentIdLst.splice(idx, 1) //用高效伪移除
                this.agentIdLst[idx] = this.agentIdLst[this.agentIdLst.length - 1];
                this.agentIdLst.length--;
            }
            delete this.aid2agent[aid];
        }
    }

    setPosition(aid, vector2) {
        if (this.aid2agent[aid]) {
            this.aid2agent[aid].position_.copy(vector2)
        }
    }

    hasAgent(aid: number) {
        return !!this.aid2agent[aid];
    }

    setAgentMass(agentNo: number, mass: number) {
        this.aid2agent[agentNo].mass = mass;
    }

    getAgentMass(agentNo: number) {
        return this.aid2agent[agentNo].mass;
    }

    setAgentRadius(agentNo: number, radius: number) {
        this.aid2agent[agentNo].radius_ = radius;
    }

    run(dt: number) {
        this.kdTree.buildAgentTree(this.getNumAgents());
        let agentNum = this.agentIdLst.length;
        for (let i = 0; i < agentNum; i++) {
            this.aid2agent[this.agentIdLst[i]].computeNeighbors(this);
            this.aid2agent[this.agentIdLst[i]].computeNewVelocity(dt);
        }
        for (let i = 0; i < agentNum; i++) {
            this.aid2agent[this.agentIdLst[i]].update(dt);
        }

        this.time += dt;
    }

    addObstacle(vertices: Vector2[]) {
        if (vertices.length < 2) {
            return -1;
        }

        let obstacleNo = this.obstacles.length;

        for (let i = 0; i < vertices.length; ++i) {
            let obstacle = new Obstacle();
            obstacle.point = vertices[i];
            if (i != 0) {
                obstacle.previous = this.obstacles[this.obstacles.length - 1];
                obstacle.previous.next = obstacle;
            }
            if (i == vertices.length - 1) {
                obstacle.next = this.obstacles[obstacleNo];
                obstacle.next.previous = obstacle;
            }
            obstacle.direction = RVOMath.normalize(vertices[(i == vertices.length - 1 ? 0 : i + 1)].minus(vertices[i]));

            if (vertices.length == 2) {
                obstacle.convex = true;
            }
            else {
                obstacle.convex = (RVOMath.leftOf(vertices[(i == 0 ? vertices.length - 1 : i - 1)], vertices[i], vertices[(i == vertices.length - 1 ? 0 : i + 1)]) >= 0);
            }

            obstacle.id = this.obstacles.length;

            this.obstacles.push(obstacle);
        }

        return obstacleNo;
    }

    processObstacles() {
        this.kdTree.buildObstacleTree();
    };

    queryVisibility(point1: Vector2, point2: Vector2, radius: number) {
        return this.kdTree.queryVisibility(point1, point2, radius);
    };

    getObstacles() {
        return this.obstacles;
    }

    clear() {
        this.agentIdLst.length = 0;
        this.agentId = 0;
        this.aid2agent = Object.create(null);
        this.kdTree = new KdTree(Simulator);
        this.obstacles.length = 0;
    }
}