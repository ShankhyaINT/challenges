// download notice
export const noticeData = async (req, res, next) => {
  try {
    let noticeIds = null;

    if (req.body.ids.length > 0) {
      noticeIds = await noticeService.downloadNotice(req.body.ids);
    }

    if (noticeIds) {
      let data = [];

      data = noticeIds.map((record) => {
        // Response keys are in korean as it is required
        return {
          id: record.notices_id,
          범주: record.category,
          제목: record.title,
          설명: record.description,
          파일_이름: record.file_name,
          파일_원본_이름: record.file_original_name,
          데이트: record.update_date,
        };
      });

      const PATH = "src//public//noticeData.xlsx";
      const spreadsheet = new SpreadSheet(PATH);
      spreadsheet.exportDataFile(data);

      res.status(200).download(PATH);
    } else {
      const title = req.query.title ? req.query.name : "";

      let data = [];

      const listData = await noticeService.noticeSearch(title);

      data = listData.map((record) => {
        // Response keys are in korean as it is required
        return {
          id: record.notices_id,
          범주: record.category,
          제목: record.title,
          설명: record.description,
          파일_이름: record.file_name,
          파일_원본_이름: record.file_original_name,
          데이트: record.update_date,
        };
      });

      const PATH = "src//public//noticeData.xlsx";
      const spreadsheet = new SpreadSheet(PATH);
      spreadsheet.exportDataFile(data);

      res.status(200).download(PATH);
    }
  } catch (error) {
    next(error);
  }
};


// Download inquiry data
export const inquiryData = async (req, res, next) => {
    try {
      let inquiryIds = null;
      if (req.body.inquiryIds.length > 0) {
        inquiryIds = await inquiryService.downloadInquiry(req.body.inquiryIds);
      }
      if (inquiryIds) {
        let listData = [];
        listData = inquiryIds.map((item) => {
          // Response keys are in korean as it is required
          return {
            인덱스: item.id,
            제목: item.title,
            문의_작성_인덱스: item.question_user_id,
            문의_작성_이름: decryptData(item.user_name),
            문의_작성_회사_유형: USER_COMPANY_STATUS[item.company_classification],
            문의_작성_회사_이름: item.company_name,
            답변_상태: item.status,
            문의_날짜: item.create_date,
            전화_번호: decryptData(item.phone_number),
          };
        });
  
        const PATH = "src//public//inquiryData.xlsx";
        const spreadsheet = new SpreadSheet(PATH);
        spreadsheet.exportDataFile(listData);
  
        res.status(200).download(PATH);
      } else {
        const title = req.query.title;
        const status = req.query.status;
  
        let inquiries = [];
        const filters = {
          title,
          status,
        }
       
        const listData = await inquiryService.searchInquiry({
           ...filters
        }
        );
        inquiries = listData.map((item) => {
          // Response keys are in korean as it is required
          return {
            인덱스: item.id,
            제목: item.title,
            문의_작성_인덱스: item.question_user_id,
            문의_작성_이름: decryptData(item.user_name),
            문의_작성_회사_유형: USER_COMPANY_STATUS[item.company_classification],
            문의_작성_회사_이름: item.company_name,
            답변_상태: item.status,
            문의_날짜: item.create_date,
            전화_번호: decryptData(item.phone_number),
          };
        });
        
        const PATH = "src//public//inquiryData.xlsx";
        const spreadsheet = new SpreadSheet(PATH);
        spreadsheet.exportDataFile(inquiries);
  
        res.status(200).download(PATH);
      }
    } catch (error) {
      next(error);
    }
  };


  