// query to search inquiry based on parameters
export const searchInquiry = async ({ title, status, limit, offset }, isCount = false) => {
	let query =
	  `SELECT ` +
	  (isCount
		? ` count(DISTINCT qna.id) as total_records `
		: ` qna.id,qna.title,qna.question,qna.question_user_id,qna.answer,qna.answer_user_id,qna.status,qna.create_date,user.user_name,user.phone_number,company.company_name,company.company_classification `) +
	  ` FROM ${TABLES.QNA} qna `;
	query += ` LEFT JOIN ${TABLES.USER_TABLE} user ON qna.question_user_id = user.id LEFT JOIN ${TABLES.USER_COMPANY} company ON user.company_id = company.id`;
  
	let condition = "";
  
	if (title) {
	  condition +=
		(!condition ? ` WHERE ` : ` AND `) +
		` qna.title LIKE  '%${title}%' OR qna.question  LIKE  '%${title}%' `;
	}
  
	if (status) {
	  condition += (!condition ? ` WHERE ` : ` AND `) + `  qna.status = '${status}'  `;
	}
  
	query += ` ${condition} `;
  
	if (!isCount && typeof offset !== "undefined" && limit) {
	  query += ` LIMIT ${offset}, ${limit} `;
	}
  
	const result = await executeQuery(query);
	return result;
  };


  // Download companies based on ids
  export const downloadCompanies = async (companyIds) => {
	const dataSet = new Set();
	companyIds.forEach((element) => {
	  if (element) {
		dataSet.add(element);
	  }
	});
  
	let ids = ``;
	for (const item of dataSet) {
	  ids += `${item},`;
	}
	ids = ids.slice(0, ids.length - 1);
  
	let query = `SELECT company.id,company.company_name AS name,company.company_classification,company.representative_name,company.business_number,tuser.user_name AS manager_name,tuser.phone_number as phone_number,company.inflow_classification,company.certification_status,(SELECT COUNT(tuser.company_id) FROM ${TABLES.USER_TABLE} tuser WHERE (company.id=tuser.company_id) GROUP BY company.id) AS members FROM ${TABLES.USER_COMPANY} company LEFT JOIN ${TABLES.USER_TABLE} tuser ON tuser.id=company.manager_id WHERE company.id IN (${ids})`;
  
	return await executeQuery(query);
  };

  // Search notice based on title
  export const notice = async (title, isCount, offset, limit) => {
	let query =
	  `SELECT ` +
	  (isCount
		? ` count(notices.id) as totalRecords `
		: ` notices.id as noticeId,notices.category,notices.title,notices.description,notices.created_by,notices.updated_by,notices.create_date,notices.update_date,noticesFile.id,noticesFile.notices_id,noticesFile.file_name as noticeFileName,noticesFile.file_original_name as noticeFileOriginalName `) +
	  ` FROM ${TABLES.NOTICES} notices LEFT JOIN ${TABLES.NOTICES_FILE} noticesFile on notices.id=noticesFile.notices_id`;
  
	let condition = "";
  
	if (title) {
	  condition += ` WHERE notices.title LIKE '%${title}%' `;
	}
  
	query += ` ${condition} `;
	query += `ORDER BY notices.id DESC`;
  
	if (!isCount && typeof offset !== "undefined" && limit) {
	  query += ` LIMIT ${offset}, ${limit} `;
	}
  
	return await executeQuery(query);
  };

  //Get supply details
  export const getSupplyDetails = async (company_id) => {
	let query = `SELECT *, user.user_name as manager_name FROM ${TABLES.USER_COMPANY} company`;
	query += ` LEFT JOIN ${TABLES.USER_TABLE} user ON user.company_id = company.id `;
	query += ` WHERE company.id = '${company_id}' and company.company_classification = 'BSNS_CLSFC_02'`;
  
	const result = await executeQuery(query);
	console.log(query);
	return result[0];
  };


  //Search factory
  export const factorySearch = async (
	factoryTitle,
	factorySolution,
	fatorySectors,
	registrant,
	factoryRegistrationPeriodStart,
	factoryRegistrationPeriodEnd,
	isCount,
	offset,
	limit,
  ) => {
	let query =
	  `SELECT ` +
	  (isCount
		? ` count(*) as total_records `
		: `factory.id AS factory_id,factory.title AS factory_title,factory.solution,factory.industry,factory.registration_status,factory.open_status,factory.create_date AS created,company.company_name AS registrant`) +
	  ` FROM ${TABLES.SMART_FACTORY} factory `;
	query += ` LEFT JOIN ${TABLES.USER_COMPANY} company ON company.id =  factory.company_id`;
  
	let condition = "";
  
	if (factoryTitle) {
	  condition += (!condition ? ` WHERE ` : ` AND `) + ` factory.title LIKE '%${factoryTitle}%' `;
	}
	if (factorySolution) {
	  condition += (!condition ? ` WHERE ` : ` AND `) + ` factory.solution='${factorySolution}' `;
	}
  
	if (fatorySectors) {
	  condition += (!condition ? ` WHERE ` : ` AND `) + ` factory.industry='${fatorySectors}' `;
	}
	if (factoryRegistrationPeriodStart && !factoryRegistrationPeriodEnd) {
	  condition +=
		(!condition ? ` WHERE ` : ` AND `) +
		` DATE(factory.create_date) =DATE('${factoryRegistrationPeriodStart}') `;
	}
	if (!factoryRegistrationPeriodStart && factoryRegistrationPeriodEnd) {
	  condition +=
		(!condition ? ` WHERE ` : ` AND `) +
		` DATE(factory.create_date) =DATE('${factoryRegistrationPeriodEnd}') `;
	}
	if (factoryRegistrationPeriodStart && factoryRegistrationPeriodEnd) {
	  condition +=
		(!condition ? ` WHERE ` : ` AND `) +
		` DATE(factory.create_date) BETWEEN DATE('${factoryRegistrationPeriodStart}') AND DATE('${factoryRegistrationPeriodEnd}')`;
	}
  
	query += ` ${condition} `;
  
	query += `ORDER BY factory.id DESC`;
	if (!isCount && typeof offset !== "undefined" && limit) {
	  query += ` LIMIT ${offset}, ${limit} `;
	}
  
	const result = await executeQuery(query);
	return result;
  };